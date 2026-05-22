from pydantic import BaseModel


class Employee(BaseModel):
    id: int
    name: str
    email: str
    department: str
    city: str
    phone: str