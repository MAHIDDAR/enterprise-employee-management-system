from fastapi import APIRouter

from app.database.database import SessionLocal

from app.models.employee_model import Employee

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


# GET EMPLOYEES BY COMPANY

@router.get("/")
def get_employees(company: str = "Stackly"):

    db = SessionLocal()

    employees = db.query(Employee).filter(
        Employee.company == company
    ).all()

    # SAMPLE DATA COMPANY WISE
    if len(employees) == 0:

        if company.lower() == "stackly":

            sample_employees = [

                {
                    "name": "Stackly Employee One",
                    "email": "stackly1@gmail.com",
                    "department": "Development",
                    "city": "Hyderabad",
                    "phone": "9999999991",
                    "status": "Active"
                },

                {
                    "name": "Stackly Employee Two",
                    "email": "stackly2@gmail.com",
                    "department": "HR",
                    "city": "Hyderabad",
                    "phone": "9999999992",
                    "status": "Inactive"
                }

            ]

        elif company.lower() == "tcs":

            sample_employees = [

                {
                    "name": "TCS Employee One",
                    "email": "tcs1@gmail.com",
                    "department": "Testing",
                    "city": "Chennai",
                    "phone": "8888888881",
                    "status": "Active"
                },

                {
                    "name": "TCS Employee Two",
                    "email": "tcs2@gmail.com",
                    "department": "Support",
                    "city": "Bangalore",
                    "phone": "8888888882",
                    "status": "On Leave"
                }

            ]

        else:

            sample_employees = [

                {
                    "name": f"{company} Employee One",
                    "email": f"{company.lower()}1@gmail.com",
                    "department": "General",
                    "city": "Hyderabad",
                    "phone": "7777777771",
                    "status": "Active"
                }

            ]

        for employee in sample_employees:

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

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company == company
    ).first()

    if employee:

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

    db.close()

    return {
        "message": "Employee Updated Successfully"
    }


# DELETE EMPLOYEE

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    company: str = "Stackly"
):

    db = SessionLocal()

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.company == company
    ).first()

    if employee:

        db.delete(employee)

        db.commit()

    db.close()

    return {
        "message": "Employee Deleted Successfully"
    }