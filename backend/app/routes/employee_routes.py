from fastapi import APIRouter

from app.database.database import SessionLocal

from app.models.employee_model import Employee

from app.utils.audit_logger import create_audit_log


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