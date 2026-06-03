from fastapi import APIRouter
from app.utils.jwt_handler import create_access_token

auth_router = APIRouter()

users = [

    {
        "email":"admin@gmail.com",
        "password":"admin123",
        "role":"admin"
    },

    {
        "email":"user@gmail.com",
        "password":"user123",
        "role":"user"
    }

]

# SIGNUP

@auth_router.post("/auth/signup")
def signup(user: dict):

    email = user.get("email")
    password = user.get("password")
    role = user.get("role")
    name = user.get("name")

    # CHECK EXISTING USER

    for existing_user in users:

        if existing_user["email"].lower() == email.lower():

            return {
                "message":"User Already Exists"
            }

    # ADMIN RESTRICTION

    if role == "admin":

        allowed_admin = "mahiddar@gmail.com"

        if email.lower() != allowed_admin.lower():

            return {
                "message":"Only Mahiddar Can Create Admin Account"
            }

    users.append({

        "name":name,
        "email":email,
        "password":password,
        "role":role

    })

    return {

        "message":"Signup Successful"

    }


# LOGIN

@auth_router.post("/auth/login")
def login(user: dict):

    email = user.get("email")
    password = user.get("password")
    role = user.get("role")

    for existing_user in users:

        if (

            existing_user["email"].lower()
            ==
            email.lower()

            and

            existing_user["password"]
            ==
            password

            and

            existing_user["role"]
            ==
            role

        ):

            token = create_access_token(

                data={

                    "email":email,
                    "role":role

                }

            )

            return {

                "message":"Login Successful",
                "role":existing_user["role"],
                "token":token

            }

    return {

        "message":"Invalid Credentials"

    }


# FORGOT PASSWORD

@auth_router.post("/auth/forgot-password")
def forgot_password(user: dict):

    email = user.get("email")
    new_password = user.get("password")

    for existing_user in users:

        if existing_user["email"].lower() == email.lower():

            existing_user["password"] = new_password

            return {

                "message":"Password Updated Successfully"

            }

    return {

        "message":"User Not Found"

    }