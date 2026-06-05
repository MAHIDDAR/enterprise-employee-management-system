from fastapi import APIRouter

from app.routes.auth_routes import users
from app.utils.audit_logger import create_audit_log


request_router = APIRouter()


requests_db = []


# SEND REQUEST

@request_router.post("/requests")
def send_request(data: dict):

    company = data.get("company", "Stackly")

    new_request = {

        "id": len(requests_db) + 1,

        "name": data.get("name"),

        "email": data.get("email"),

        "password": data.get("password"),

        "adminEmail": data.get("adminEmail"),

        "company": company,

        "status": "pending"

    }

    requests_db.append(new_request)

    create_audit_log(
        user_name=data.get("email", "User"),
        action="Role Change Requested",
        related_entity=f"user: {data.get('email')}",
        details=f"Requested admin role from {data.get('adminEmail')}",
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

                        user["company"] = request.get("company")

                    break

            create_audit_log(
                user_name=request.get("adminEmail", "Admin User"),
                action="Role Change Approved",
                related_entity=f"user: {request.get('email')}",
                details="User role changed to admin",
                company=request.get("company", "Stackly")
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
                company=request.get("company", "Stackly")
            )

            requests_db.remove(request)

            return {

                "message": "Rejected"

            }

    return {

        "message": "Request Not Found"

    }