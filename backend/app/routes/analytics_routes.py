from fastapi import APIRouter

from app.database.database import SessionLocal
from app.models.employee_model import Employee

from app.routes.request_routes import requests_db
from app.routes.auth_routes import users


analytics_router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# DASHBOARD KPI API

@analytics_router.get("/dashboard")
def get_dashboard_analytics(company: str = "Stackly"):

    db = SessionLocal()

    employees = db.query(Employee).filter(
        Employee.company == company
    ).all()

    total_employees = len(employees)

    active_employees = len([
        employee for employee in employees
        if (employee.status or "Active") == "Active"
    ])

    departments = set()

    for employee in employees:

        if employee.department:

            departments.add(employee.department)

    total_departments = len(departments)

    pending_requests = len([
        request for request in requests_db
        if request.get("company") == company
        and request.get("status") == "pending"
    ])

    db.close()

    return {

        "totalEmployees": total_employees,

        "activeEmployees": active_employees,

        "totalDepartments": total_departments,

        "pendingRequests": pending_requests

    }


# EMPLOYEES BY DEPARTMENT API

@analytics_router.get("/employees-by-department")
def employees_by_department(company: str = "Stackly"):

    db = SessionLocal()

    employees = db.query(Employee).filter(
        Employee.company == company
    ).all()

    department_count = {}

    for employee in employees:

        department = employee.department or "Other"

        if department in department_count:

            department_count[department] += 1

        else:

            department_count[department] = 1

    result = []

    for department, count in department_count.items():

        result.append({

            "name": department,

            "value": count

        })

    db.close()

    return result


# EMPLOYEE STATUS OVERVIEW API

@analytics_router.get("/employee-status")
def employee_status_overview(company: str = "Stackly"):

    db = SessionLocal()

    employees = db.query(Employee).filter(
        Employee.company == company
    ).all()

    status_count = {

        "Active": 0,

        "Inactive": 0,

        "On Leave": 0

    }

    for employee in employees:

        status = employee.status or "Active"

        if status in status_count:

            status_count[status] += 1

        else:

            status_count[status] = 1

    result = []

    for status, count in status_count.items():

        result.append({

            "name": status,

            "value": count

        })

    db.close()

    return result


# USER ROLE COUNT API

@analytics_router.get("/roles")
def employee_count_by_role(company: str = "Stackly"):

    role_count = {}

    for user in users:

        if user.get("company") == company:

            role = user.get("role", "user")

            if role in role_count:

                role_count[role] += 1

            else:

                role_count[role] = 1

    result = []

    for role, count in role_count.items():

        result.append({

            "name": role,

            "value": count

        })

    return result