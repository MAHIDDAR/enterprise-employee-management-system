from pydantic import (
    BaseModel,
    EmailStr,
)

class EmployeeCreate(BaseModel):

    name: str

    email: EmailStr

    city: str

    phone: str

    department_id: int