from fastapi import APIRouter

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@auth_router.post("/login")
def login(data: dict):

    email = data["email"]
    password = data["password"]

    # ADMIN LOGIN
    if (
        email == "admin@gmail.com"
        and
        password == "admin123"
    ):

        return {
            "message": "Login Successful",
            "role": "admin"
        }

    # USER LOGIN
    elif (
        email == "user@gmail.com"
        and
        password == "user123"
    ):

        return {
            "message": "Login Successful",
            "role": "user"
        }

    return {
        "message": "Invalid Credentials"
    }