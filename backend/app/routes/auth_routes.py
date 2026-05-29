from fastapi import APIRouter

from app.utils.jwt_handler import create_access_token

auth_router = APIRouter()

# DUMMY USERS
users = [
    {
        "email": "admin@gmail.com",
        "password": "admin123",
        "role": "admin"
    },
    {
        "email": "user@gmail.com",
        "password": "user123",
        "role": "user"
    }
]

# LOGIN API
@auth_router.post("/auth/login")
def login(user: dict):

    email = user.get("email")

    password = user.get("password")

    for existing_user in users:

        if (
            existing_user["email"] == email
            and existing_user["password"] == password
        ):

            # CREATE JWT TOKEN
            token = create_access_token({
                "email": existing_user["email"],
                "role": existing_user["role"]
            })

            return {
                "message": "Login Successful",
                "role": existing_user["role"],
                "token": token
            }

    return {
        "message": "Invalid Credentials"
    }