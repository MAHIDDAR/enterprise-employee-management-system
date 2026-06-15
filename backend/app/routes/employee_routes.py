from fastapi import APIRouter

import json
import urllib.request
from datetime import date

from app.database.database import SessionLocal

from app.models.employee_model import Employee

from app.utils.audit_logger import create_audit_log


router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


# FETCH EMPLOYEES FROM API

def fetch_api_employees(company: str):

    api_url = "https://jsonplaceholder.typicode.com/users"

    with urllib.request.urlopen(api_url) as response:

        api_data = response.read()

        users = json.loads(api_data)

    roles = [
        "Financial Analyst",
        "HR Manager",
        "Developer",
        "QA Engineer",
        "UI/UX Designer",
        "Sales Executive",
        "Support Engineer",
        "Marketing Executive",
        "Operations Executive",
        "SEO Specialist"
    ]

    departments = [
        "Finance",
        "Human Resources",
        "IT",
        "QA Department",
        "Design",
        "Sales",
        "Support",
        "Marketing",
        "Operations",
        "Digital Marketing"
    ]

    statuses = [
        "Active",
        "Inactive",
        "On Leave",
        "Active",
        "Active"
    ]

    joined_dates = [
        "2023-08-22",
        "2023-11-02",
        "2026-06-05",
        "2026-06-01",
        "2024-05-21",
        "2026-05-29",
        "2025-03-18",
        "2024-09-14",
        "2025-12-10",
        "2024-01-25"
    ]

    if company.lower() == "stackly":

        selected_users = users[:5]

    elif company.lower() == "tcs":

        selected_users = users[5:10]

    else:

        selected_users = users[:3]

    employees = []

    for index, user in enumerate(selected_users):

        employee = {
            "name": user.get("name"),
            "email": user.get("email"),
            "role": roles[index % len(roles)],
            "department": departments[index % len(departments)],
            "city": user.get("address", {}).get("city", "Hyderabad"),
            "phone": user.get("phone"),
            "status": statuses[index % len(statuses)],
            "joined_date": joined_dates[index % len(joined_dates)],
            "reporting_manager_id": None,
            "reporting_manager_name": "None"
        }

        employees.append(employee)

    return employees


# FORMAT EMPLOYEE RESPONSE

def format_employee(employee):

    return {
        "id": employee.id,
        "name": employee.name,
        "email": employee.email,
        "role": employee.role or "Employee",
        "department": employee.department,
        "city": employee.city,
        "phone": employee.phone,
        "company": employee.company,
        "status": employee.status or "Active",
        "joinedDate": employee.joined_date,
        "reportingManagerId": employee.reporting_manager_id,
        "reportingManagerName": employee.reporting_manager_name or "None"
    }


# GET EMPLOYEES BY COMPANY

@router.get("/")
def get_employees(company: str = "Stackly"):

    db = SessionLocal()

    employees = db.query(Employee).filter(
        Employee.company == company
    ).all()

    # IF COMPANY EMPLOYEES ARE NOT PRESENT IN DB, FETCH FROM API
    if len(employees) == 0:

        api_employees = fetch_api_employees(
            company
        )

        for employee in api_employees:

            new_employee = Employee(
                name=employee["name"],
                email=employee["email"],
                role=employee["role"],
                department=employee["department"],
                city=employee["city"],
                phone=employee["phone"],
                company=company,
                status=employee["status"],
                joined_date=employee["joined_date"],
                reporting_manager_id=employee["reporting_manager_id"],
                reporting_manager_name=employee["reporting_manager_name"]
            )

            db.add(new_employee)

        db.commit()

        employees = db.query(Employee).filter(
            Employee.company == company
        ).all()

        # ASSIGN FIRST EMPLOYEE AS REPORTING MANAGER FOR OTHERS
        if len(employees) > 1:

            manager = employees[0]

            for employee in employees[1:]:

                employee.reporting_manager_id = manager.id
                employee.reporting_manager_name = f"{manager.name} ({manager.role})"

            db.commit()

            employees = db.query(Employee).filter(
                Employee.company == company
            ).all()

    result = []

    for employee in employees:

        result.append(
            format_employee(employee)
        )

    db.close()

    return result


# GET SINGLE EMPLOYEE DETAILS

@router.get("/{employee_id}")
def get_employee_details(
    employee_id: int,
    company: str = "Stackly"
):

    db = SessionLocal()

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company == company
    ).first()

    if not employee:

        db.close()

        return {
            "message": "Employee Not Found"
        }

    result = format_employee(employee)

    db.close()

    return result


# GET REPORTING MANAGERS FOR DROPDOWN

@router.get("/managers/list")
def get_reporting_managers(company: str = "Stackly"):

    db = SessionLocal()

    employees = db.query(Employee).filter(
        Employee.company == company
    ).all()

    result = [
        {
            "id": "",
            "name": "None",
            "role": "",
            "label": "None"
        }
    ]

    for employee in employees:

        result.append({
            "id": employee.id,
            "name": employee.name,
            "role": employee.role or "Employee",
            "label": f"{employee.name} ({employee.role or 'Employee'})"
        })

    db.close()

    return result


# ADD EMPLOYEE

@router.post("/")
def add_employee(employee: dict):

    db = SessionLocal()

    company = employee.get("company", "Stackly")

    user_name = employee.get(
        "userName",
        employee.get("createdBy", "Admin User")
    )

    existing_employee = db.query(Employee).filter(
        Employee.email == employee["email"],
        Employee.company == company
    ).first()

    if existing_employee:

        db.close()

        return {
            "message": "Employee Already Exists"
        }

    reporting_manager_id = employee.get(
        "reportingManagerId",
        None
    )

    reporting_manager_name = "None"

    if reporting_manager_id:

        manager = db.query(Employee).filter(
            Employee.id == int(reporting_manager_id),
            Employee.company == company
        ).first()

        if manager:

            reporting_manager_name = f"{manager.name} ({manager.role or 'Employee'})"

    new_employee = Employee(
        name=employee["name"],
        email=employee["email"],
        role=employee.get("role", "Employee"),
        department=employee["department"],
        city=employee.get("city", ""),
        phone=employee.get("phone", ""),
        company=company,
        status=employee.get("status", "Active"),
        joined_date=employee.get(
            "joinedDate",
            str(date.today())
        ),
        reporting_manager_id=reporting_manager_id,
        reporting_manager_name=reporting_manager_name
    )

    db.add(new_employee)

    db.commit()

    db.refresh(new_employee)

    created_employee_name = new_employee.name
    created_employee_department = new_employee.department

    db.close()

    create_audit_log(
        user_name=user_name,
        action="Employee Created",
        related_entity=f"employee: {created_employee_name}",
        details=f"Created employee in {created_employee_department}",
        company=company
    )

    return {
        "message": "Employee Added Successfully"
    }


# UPDATE EMPLOYEE

@router.put("/{employee_id}")
def update_employee(
    employee_id: int,
    updated_employee: dict
):

    db = SessionLocal()

    company = updated_employee.get("company", "Stackly")

    user_name = updated_employee.get(
        "userName",
        updated_employee.get("updatedBy", "Admin User")
    )

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company == company
    ).first()

    old_status = None

    if employee:

        old_status = employee.status

        reporting_manager_id = updated_employee.get(
            "reportingManagerId",
            None
        )

        reporting_manager_name = "None"

        if reporting_manager_id:

            manager = db.query(Employee).filter(
                Employee.id == int(reporting_manager_id),
                Employee.company == company
            ).first()

            if manager:

                reporting_manager_name = f"{manager.name} ({manager.role or 'Employee'})"

        employee.name = updated_employee["name"]
        employee.email = updated_employee["email"]
        employee.role = updated_employee.get(
            "role",
            employee.role or "Employee"
        )
        employee.department = updated_employee["department"]
        employee.city = updated_employee.get(
            "city",
            employee.city or ""
        )
        employee.phone = updated_employee.get(
            "phone",
            employee.phone or ""
        )
        employee.company = company
        employee.status = updated_employee.get(
            "status",
            employee.status or "Active"
        )
        employee.joined_date = updated_employee.get(
            "joinedDate",
            employee.joined_date
        )
        employee.reporting_manager_id = reporting_manager_id
        employee.reporting_manager_name = reporting_manager_name

        db.commit()

        related_employee_name = employee.name

        new_status = employee.status

    else:

        related_employee_name = "Unknown Employee"

        new_status = None

    db.close()

    details = "Employee details updated"

    if old_status and new_status and old_status != new_status:

        details = f"Status changed from {old_status} to {new_status}"

    create_audit_log(
        user_name=user_name,
        action="Employee Updated",
        related_entity=f"employee: {related_employee_name}",
        details=details,
        company=company
    )

    return {
        "message": "Employee Updated Successfully"
    }


# DELETE EMPLOYEE

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    company: str = "Stackly",
    userName: str = "Admin User"
):

    db = SessionLocal()

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company == company
    ).first()

    employee_name = "Unknown Employee"

    if employee:

        employee_name = employee.name

        db.delete(employee)

        db.commit()

    db.close()

    create_audit_log(
        user_name=userName,
        action="Employee Deleted",
        related_entity=f"employee: {employee_name}",
        details="Employee removed from system",
        company=company
    )

    return {
        "message": "Employee Deleted Successfully"
    }