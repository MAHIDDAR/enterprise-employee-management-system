from fastapi import APIRouter

from app.database.database import SessionLocal

from app.models.employee_model import Employee

import requests

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

# GET ALL EMPLOYEES
@router.get("/")
def get_employees():

    db = SessionLocal()

    employees = db.query(Employee).all()

    # CHECK IF API DATA EXISTS
    if len(employees) < 10:

        api_response = requests.get(
            "https://jsonplaceholder.typicode.com/users"
        )

        api_employees = api_response.json()

        for employee in api_employees:

            existing_employee = db.query(Employee).filter(
                Employee.email == employee["email"]
            ).first()

            # AVOID DUPLICATES
            if not existing_employee:

                new_employee = Employee(
                    name=employee["name"],
                    email=employee["email"],
                    department=employee["company"]["name"],
                    city=employee["address"]["city"],
                    phone=employee["phone"]
                )

                db.add(new_employee)

        db.commit()

        employees = db.query(Employee).all()

    result = []

    for employee in employees:

        result.append({
            "id": employee.id,
            "name": employee.name,
            "email": employee.email,
            "department": employee.department,
            "city": employee.city,
            "phone": employee.phone
        })

    db.close()

    return result



@router.post("/")
def add_employee(employee: dict):

    db = SessionLocal()

    new_employee = Employee(
        name=employee["name"],
        email=employee["email"],
        department=employee["department"],
        city=employee["city"],
        phone=employee["phone"]
    )

    db.add(new_employee)

    db.commit()

    db.refresh(new_employee)

    db.close()

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

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if employee:

        employee.name = updated_employee["name"]
        employee.email = updated_employee["email"]
        employee.department = updated_employee["department"]
        employee.city = updated_employee["city"]
        employee.phone = updated_employee["phone"]

        db.commit()

    db.close()

    return {
        "message": "Employee Updated Successfully"
    }


# DELETE EMPLOYEE
@router.delete("/{employee_id}")
def delete_employee(employee_id: int):

    db = SessionLocal()

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if employee:

        db.delete(employee)

        db.commit()

    db.close()

    return {
        "message": "Employee Deleted Successfully"
    }