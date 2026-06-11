from fastapi import APIRouter

from app.database.database import SessionLocal
from app.models.invitation_model import Invitation

from app.routes.auth_routes import users
from app.routes.auth_routes import normalize_company

from app.utils.audit_logger import create_audit_log


invitation_router = APIRouter(
    prefix="/invitations",
    tags=["Invitations"]
)


reactivation_requests = []


# PENDING REACTIVATION COUNT FOR DASHBOARD

def get_pending_reactivation_count(company: str):

    company = normalize_company(company)

    count = 0

    for request in reactivation_requests:

        if (
            request.get("company") == company
            and
            request.get("status") == "pending"
        ):

            count += 1

    return count


# CREATE INVITATION

@invitation_router.post("/")
def create_invitation(data: dict):

    db = SessionLocal()

    email = data.get("email")

    role = data.get("role", "user")

    company = normalize_company(
        data.get("company", "Stackly")
    )

    invited_by = data.get("invitedBy", "Admin User")

    existing_invitation = db.query(Invitation).filter(
        Invitation.email == email,
        Invitation.company == company,
        Invitation.status == "pending"
    ).first()

    if existing_invitation:

        db.close()

        return {
            "message": "Invitation Already Exists"
        }

    invitation_link = (
        f"http://localhost:5173/signup"
        f"?company={company}"
        f"&email={email}"
        f"&role={role}"
    )

    new_invitation = Invitation(
        email=email,
        role=role,
        company=company,
        invited_by=invited_by,
        status="pending",
        invitation_link=invitation_link
    )

    db.add(new_invitation)

    db.commit()

    db.refresh(new_invitation)

    create_audit_log(
        user_name=invited_by,
        action="Invitation Created",
        related_entity=f"user: {email}",
        details=f"Invitation created for {role}",
        company=company
    )

    result = {
        "message": "Invitation Created",
        "data": {
            "id": new_invitation.id,
            "email": new_invitation.email,
            "role": new_invitation.role,
            "company": new_invitation.company,
            "status": new_invitation.status,
            "invitationLink": new_invitation.invitation_link
        }
    }

    db.close()

    return result


# GET INVITATIONS

@invitation_router.get("/")
def get_invitations(company: str = "Stackly"):

    db = SessionLocal()

    company = normalize_company(company)

    invitations = db.query(Invitation).filter(
        Invitation.company == company
    ).all()

    result = []

    for invitation in invitations:

        result.append({
            "id": invitation.id,
            "email": invitation.email,
            "role": invitation.role,
            "company": invitation.company,
            "status": invitation.status,
            "invitationLink": invitation.invitation_link,
            "invitedBy": invitation.invited_by,
            "createdAt": invitation.created_at.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        })

    db.close()

    return result


# REVOKE INVITATION

@invitation_router.put("/{invitation_id}/revoke")
def revoke_invitation(
    invitation_id: int,
    data: dict
):

    db = SessionLocal()

    company = normalize_company(
        data.get("company", "Stackly")
    )

    revoked_by = data.get("revokedBy", "Admin User")

    invitation = db.query(Invitation).filter(
        Invitation.id == invitation_id,
        Invitation.company == company
    ).first()

    if not invitation:

        db.close()

        return {
            "message": "Invitation Not Found"
        }

    invitation.status = "revoked"

    db.commit()

    create_audit_log(
        user_name=revoked_by,
        action="Invitation Revoked",
        related_entity=f"user: {invitation.email}",
        details="Pending invitation revoked",
        company=company
    )

    db.close()

    return {
        "message": "Invitation Revoked"
    }


# GET COMPANY MEMBERS

@invitation_router.get("/members")
def get_members(company: str = "Stackly"):

    company = normalize_company(company)

    company_members = []

    for user in users:

        if normalize_company(
            user.get("company")
        ) == company:

            company_members.append({
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role"),
                "company": normalize_company(
                    user.get("company")
                ),
                "status": user.get("status", "Active"),
                "reactivationStatus": user.get(
                    "reactivationStatus",
                    "Not Requested"
                ),
                "deactivatedBy": user.get(
                    "deactivatedBy",
                    ""
                )
            })

    return company_members


# DEACTIVATE USER

@invitation_router.put("/members/deactivate")
def deactivate_user(data: dict):

    email = data.get("email")

    company = normalize_company(
        data.get("company", "Stackly")
    )

    deactivated_by = data.get(
        "deactivatedBy",
        "Admin User"
    )

    for user in users:

        if (
            user.get("email") == email
            and
            normalize_company(user.get("company")) == company
        ):

            user["status"] = "Deactivated"

            user["deactivatedBy"] = deactivated_by

            user["reactivationStatus"] = "Not Requested"

            create_audit_log(
                user_name=deactivated_by,
                action="User Deactivated",
                related_entity=f"user: {email}",
                details=f"User account deactivated by {deactivated_by}",
                company=company
            )

            return {
                "message": "User Deactivated"
            }

    return {
        "message": "User Not Found"
    }


# SUBMIT REACTIVATION REQUEST

@invitation_router.post("/reactivation-request")
def submit_reactivation_request(data: dict):

    email = data.get("email")

    company = normalize_company(
        data.get("company", "Stackly")
    )

    requested_by = data.get("requestedBy", email)

    deactivated_by = data.get("deactivatedBy", "")

    reactivation_message = data.get("message", "")

    for request in reactivation_requests:

        if (
            request.get("email") == email
            and
            request.get("company") == company
            and
            request.get("status") == "pending"
        ):

            return {
                "message": "Request Already Pending"
            }

    for user in users:

        if (
            user.get("email") == email
            and
            normalize_company(user.get("company")) == company
        ):

            deactivated_by = user.get(
                "deactivatedBy",
                deactivated_by
            )

            break

    new_request = {
        "id": len(reactivation_requests) + 1,
        "email": email,
        "company": company,
        "requestedBy": requested_by,
        "deactivatedBy": deactivated_by,
        "message": reactivation_message,
        "status": "pending"
    }

    reactivation_requests.append(new_request)

    for user in users:

        if (
            user.get("email") == email
            and
            normalize_company(user.get("company")) == company
        ):

            user["reactivationStatus"] = "pending"

            break

    audit_action = "Reactivation Request Submitted"

    if reactivation_message.strip():

        audit_action = (
            f"Reactivation Request Submitted - "
            f"{reactivation_message}"
        )

    create_audit_log(
        user_name=requested_by,
        action=audit_action,
        related_entity=f"user: {email}",
        details=f"User submitted reactivation request. Deactivated by {deactivated_by}",
        company=company
    )

    return {
        "message": "Reactivation Request Submitted",
        "data": new_request
    }


# GET REACTIVATION REQUESTS

@invitation_router.get("/reactivation-requests")
def get_reactivation_requests(company: str = "Stackly"):

    company = normalize_company(company)

    result = []

    for request in reactivation_requests:

        if request.get("company") == company:

            result.append(request)

    return result


# APPROVE REACTIVATION

@invitation_router.put("/reactivation/{request_id}/approve")
def approve_reactivation(
    request_id: int,
    data: dict
):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    approved_by = data.get("approvedBy", "Admin User")

    for request in reactivation_requests:

        if (
            request.get("id") == request_id
            and
            request.get("company") == company
        ):

            request["status"] = "approved"

            for user in users:

                if (
                    user.get("email") == request.get("email")
                    and
                    normalize_company(user.get("company")) == company
                ):

                    user["status"] = "Active"

                    user["reactivationStatus"] = "approved"

                    user["deactivatedBy"] = ""

                    break

            create_audit_log(
                user_name=approved_by,
                action="Reactivation Approved",
                related_entity=f"user: {request.get('email')}",
                details="User reactivation request approved",
                company=company
            )

            create_audit_log(
                user_name=approved_by,
                action="User Activated",
                related_entity=f"user: {request.get('email')}",
                details="User account activated again",
                company=company
            )

            return {
                "message": "Reactivation Approved"
            }

    return {
        "message": "Request Not Found"
    }


# REJECT REACTIVATION

@invitation_router.put("/reactivation/{request_id}/reject")
def reject_reactivation(
    request_id: int,
    data: dict
):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    rejected_by = data.get("rejectedBy", "Admin User")

    for request in reactivation_requests:

        if (
            request.get("id") == request_id
            and
            request.get("company") == company
        ):

            request["status"] = "rejected"

            for user in users:

                if (
                    user.get("email") == request.get("email")
                    and
                    normalize_company(user.get("company")) == company
                ):

                    user["reactivationStatus"] = "rejected"

                    break

            create_audit_log(
                user_name=rejected_by,
                action="Reactivation Rejected",
                related_entity=f"user: {request.get('email')}",
                details="Reactivation request rejected",
                company=company
            )

            return {
                "message": "Reactivation Rejected"
            }

    return {
        "message": "Request Not Found"
    }