from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database.database import Base


class Company(Base):

    __tablename__ = "companies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String, unique=True)