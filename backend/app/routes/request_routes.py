from fastapi import APIRouter

from app.routes.auth_routes import users
from app.routes.auth_routes import normalize_company
from app.utils.audit_logger import create_audit_log


request_router = APIRouter()


requests_db = []


# SEND REQUEST

@request_router.post("/requests")
def send_request(data: dict):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    email = data.get("email")

    password = data.get("password")

    admin_email = data.get("adminEmail")

    # CHECK USER EXISTS AND PASSWORD IS CORRECT
    current_user = None

    for user in users:

        if (
            user.get("email", "").lower() == email.lower()
            and
            normalize_company(user.get("company")) == company
        ):

            current_user = user

            break

    if not current_user:

        return {
            "message": "User Not Found"
        }

    if current_user.get("password") != password:

        return {
            "message": "Invalid Credentials"
        }

    # CHECK ADMIN EMAIL EXISTS IN SAME COMPANY
    admin_user = None

    for user in users:

        if (
            user.get("email", "").lower() == admin_email.lower()
            and
            user.get("role") == "admin"
            and
            normalize_company(user.get("company")) == company
        ):

            admin_user = user

            break

    if not admin_user:

        return {
            "message": "Invalid Admin Email"
        }

    # CHECK IF REQUEST ALREADY EXISTS
    for request in requests_db:

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

    new_request = {

        "id": len(requests_db) + 1,

        "name": data.get("name"),

        "email": email,

        "password": password,

        "adminEmail": admin_email,

        "company": company,

        "status": "pending"

    }

    requests_db.append(new_request)

    create_audit_log(
        user_name=email,
        action="Role Change Requested",
        related_entity=f"user: {email}",
        details=f"Requested admin role from {admin_email}",
        company=company
    )

    return {

        "message": "Request Sent",

        "data": new_request

    }


# GET REQUESTS

@request_router.get("/requests")
def get_requests():

    return requests_db


# APPROVE REQUEST

@request_router.put("/requests/{request_id}/approve")
def approve_request(request_id: int):

    for request in requests_db:

        if request["id"] == request_id:

            request["status"] = "approved"

            for user in users:

                if user["email"] == request["email"]:

                    user["role"] = "admin"

                    if request.get("company"):

                        user["company"] = normalize_company(
                            request.get("company")
                        )

                    break

            create_audit_log(
                user_name=request.get("adminEmail", "Admin User"),
                action="Role Change Approved",
                related_entity=f"user: {request.get('email')}",
                details="User role changed to admin",
                company=normalize_company(
                    request.get("company", "Stackly")
                )
            )

            requests_db.remove(request)

            return {

                "message": "Approved"

            }

    return {

        "message": "Request Not Found"

    }


# REJECT REQUEST

@request_router.put("/requests/{request_id}/reject")
def reject_request(request_id: int):

    for request in requests_db:

        if request["id"] == request_id:

            create_audit_log(
                user_name=request.get("adminEmail", "Admin User"),
                action="Role Change Rejected",
                related_entity=f"user: {request.get('email')}",
                details="Admin role request rejected",
                company=normalize_company(
                    request.get("company", "Stackly")
                )
            )

            requests_db.remove(request)

            return {

                "message": "Rejected"

            }

    return {

        "message": "Request Not Found"

    }