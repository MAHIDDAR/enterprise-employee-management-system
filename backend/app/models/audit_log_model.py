from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database.database import Base


class AuditLog(Base):

    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_name = Column(String)

    action = Column(String)

    related_entity = Column(String)

    details = Column(String)

    company = Column(String)

    timestamp = Column(
        DateTime,
        default=datetime.now
    )