from fastapi import APIRouter
from app.utils.jwt_handler import create_access_token


auth_router = APIRouter()


users = [

    {
        "name": "Stackly Admin",
        "email": "admin@gmail.com",
        "password": "admin123",
        "role": "admin",
        "company": "Stackly"
    },

    {
        "name": "Stackly User",
        "email": "user@gmail.com",
        "password": "user123",
        "role": "user",
        "company": "Stackly"
    },

    {
        "name": "TCS Admin",
        "email": "tcsadmin@gmail.com",
        "password": "admin123",
        "role": "admin",
        "company": "TCS"
    },

    {
        "name": "TCS User",
        "email": "tcsuser@gmail.com",
        "password": "user123",
        "role": "user",
        "company": "TCS"
    }

]


# NORMALIZE COMPANY NAME

def normalize_company(company):

    if not company:

        return "Stackly"

    if company.lower() == "tcs":

        return "TCS"

    if company.lower() == "stackly":

        return "Stackly"

    return company.strip()


# SIGNUP

@auth_router.post("/auth/signup")
def signup(user: dict):

    email = user.get("email")
    password = user.get("password")
    role = user.get("role")
    name = user.get("name")
    company = normalize_company(
        user.get("company")
    )

    for existing_user in users:

        if existing_user["email"].lower() == email.lower():

            return {
                "message": "User Already Exists"
            }

    users.append({

        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "company": company

    })

    return {

        "message": "Signup Successful"

    }


# LOGIN

@auth_router.post("/auth/login")
def login(user: dict):

    email = user.get("email")
    password = user.get("password")
    role = user.get("role")
    company = normalize_company(
        user.get("company")
    )

    for existing_user in users:

        if (

            existing_user.get("email", "").lower()
            ==
            email.lower()

            and

            existing_user.get("password")
            ==
            password

            and

            existing_user.get("role")
            ==
            role

            and

            normalize_company(
                existing_user.get("company")
            )
            ==
            company

        ):

            token = create_access_token(

                data={

                    "email": email,
                    "role": role,
                    "company": company

                }

            )

            return {

                "message": "Login Successful",
                "role": existing_user["role"],
                "company": company,
                "token": token

            }

    return {

        "message": "Invalid Credentials"

    }


# GET USERS BY COMPANY

@auth_router.get("/auth/users")
def get_users(company: str):

    company = normalize_company(company)

    company_users = []

    for user in users:

        if normalize_company(
            user.get("company")
        ) == company:

            company_users.append({

                "name": user.get("name"),

                "email": user.get("email"),

                "role": user.get("role"),

                "company": normalize_company(
                    user.get("company")
                )

            })

    return company_users


# FORGOT PASSWORD

@auth_router.post("/auth/forgot-password")
def forgot_password(user: dict):

    email = user.get("email")
    new_password = user.get("password")

    for existing_user in users:

        if existing_user["email"].lower() == email.lower():

            existing_user["password"] = new_password

            return {

                "message": "Password Updated Successfully"

            }

    return {

        "message": "User Not Found"

    }