from fastapi import APIRouter

import json
import urllib.request

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

    departments = [
        "Development",
        "HR",
        "Testing",
        "Support",
        "Finance",
        "Marketing",
        "Operations",
        "Sales",
        "Design",
        "Management"
    ]

    statuses = [
        "Active",
        "Inactive",
        "On Leave"
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
            "department": departments[index % len(departments)],
            "city": user.get("address", {}).get("city", "Hyderabad"),
            "phone": user.get("phone"),
            "status": statuses[index % len(statuses)]
        }

        employees.append(employee)

    return employees


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
                department=employee["department"],
                city=employee["city"],
                phone=employee["phone"],
                company=company,
                status=employee["status"]
            )

            db.add(new_employee)

        db.commit()

        employees = db.query(Employee).filter(
            Employee.company == company
        ).all()

    result = []

    for employee in employees:

        result.append({
            "id": employee.id,
            "name": employee.name,
            "email": employee.email,
            "department": employee.department,
            "city": employee.city,
            "phone": employee.phone,
            "company": employee.company,
            "status": employee.status or "Active"
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

    new_employee = Employee(
        name=employee["name"],
        email=employee["email"],
        department=employee["department"],
        city=employee["city"],
        phone=employee["phone"],
        company=company,
        status=employee.get("status", "Active")
    )

    db.add(new_employee)

    db.commit()

    db.refresh(new_employee)

    db.close()

    create_audit_log(
        user_name=user_name,
        action="Employee Created",
        related_entity=f"employee: {new_employee.name}",
        details=f"Created employee in {new_employee.department}",
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

        employee.name = updated_employee["name"]
        employee.email = updated_employee["email"]
        employee.department = updated_employee["department"]
        employee.city = updated_employee["city"]
        employee.phone = updated_employee["phone"]
        employee.company = company
        employee.status = updated_employee.get(
            "status",
            employee.status or "Active"
        )

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