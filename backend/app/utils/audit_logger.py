from app.database.database import SessionLocal
from app.models.audit_log_model import AuditLog


def create_audit_log(
    user_name,
    action,
    related_entity,
    details,
    company
):

    db = SessionLocal()

    new_log = AuditLog(

        user_name=user_name,

        action=action,

        related_entity=related_entity,

        details=details,

        company=company

    )

    db.add(new_log)

    db.commit()

    db.close()