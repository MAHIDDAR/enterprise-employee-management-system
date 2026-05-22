from fastapi import APIRouter

from app.controllers.employee_controller import (
    get_all_employees,
    get_employee_by_id
)

router = APIRouter()


@router.get("/employees")
def fetch_employees():
    return get_all_employees()


@router.get("/employees/{employee_id}")
def fetch_employee(employee_id: int):
    return get_employee_by_id(employee_id)