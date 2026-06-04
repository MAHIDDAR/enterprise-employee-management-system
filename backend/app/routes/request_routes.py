from fastapi import APIRouter


request_router = APIRouter()


requests_db = []


# SEND REQUEST

@request_router.post("/requests")
def send_request(data: dict):

    new_request = {

        "id": len(requests_db) + 1,

        "name": data.get("name"),

        "email": data.get("email"),

        "password": data.get("password"),

        "adminEmail": data.get("adminEmail"),

        "company": data.get("company"),

        "status": "pending"

    }

    requests_db.append(new_request)

    return {

        "message": "Request Sent",

        "data": new_request

    }


# GET REQUESTS

@request_router.get("/requests")
def get_requests():

    return requests_db


# APPROVE REQUEST

from app.routes.auth_routes import users


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

            requests_db.remove(request)

            return {

                "message": "Rejected"

            }

    return {

        "message": "Request Not Found"

    }