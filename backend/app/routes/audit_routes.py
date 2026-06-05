from fastapi import APIRouter

from app.database.database import SessionLocal
from app.models.audit_log_model import AuditLog


audit_router = APIRouter()


@audit_router.get("/audit-logs")
def get_audit_logs(company: str = "Stackly"):

    db = SessionLocal()

    logs = db.query(AuditLog).filter(
        AuditLog.company == company
    ).order_by(
        AuditLog.timestamp.desc()
    ).all()

    result = []

    for log in logs:

        result.append({

            "id": log.id,

            "userName": log.user_name,

            "action": log.action,

            "relatedEntity": log.related_entity,

            "details": log.details,

            "company": log.company,

            "timestamp": log.timestamp.strftime(
                "%Y-%m-%d %H:%M:%S"
            )

        })

    db.close()

    return result