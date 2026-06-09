from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database.database import Base


class Invitation(Base):

    __tablename__ = "invitations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(String)

    role = Column(String)

    company = Column(String)

    invited_by = Column(String)

    status = Column(String, default="pending")

    invitation_link = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.now
    )