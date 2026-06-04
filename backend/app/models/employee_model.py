from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database.database import Base


class Employee(Base):

    __tablename__ = "employees"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String)

    email = Column(String)

    department = Column(String)

    city = Column(String)

    phone = Column(String)

    company = Column(String)

    status = Column(String, default="Active")