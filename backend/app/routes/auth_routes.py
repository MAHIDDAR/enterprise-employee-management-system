from fastapi import APIRouter

from app.utils.jwt_handler import create_access_token


auth_router = APIRouter()


users = [

    {
        "name": "Stackly Admin",
        "email": "admin@gmail.com",
        "password": "admin123",
        "role": "admin",
        "company": "Stackly",
        "plan": "Free",
        "status": "Active",
        "reactivationStatus": "Not Requested",
        "deactivatedBy": ""
    },

    {
        "name": "Stackly User",
        "email": "user@gmail.com",
        "password": "user123",
        "role": "user",
        "company": "Stackly",
        "plan": "Free",
        "status": "Active",
        "reactivationStatus": "Not Requested",
        "deactivatedBy": ""
    },

    {
        "name": "TCS Admin",
        "email": "tcsadmin@gmail.com",
        "password": "admin123",
        "role": "admin",
        "company": "TCS",
        "plan": "Free",
        "status": "Active",
        "reactivationStatus": "Not Requested",
        "deactivatedBy": ""
    },

    {
        "name": "TCS User",
        "email": "tcsuser@gmail.com",
        "password": "user123",
        "role": "user",
        "company": "TCS",
        "plan": "Free",
        "status": "Active",
        "reactivationStatus": "Not Requested",
        "deactivatedBy": ""
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
    role = user.get("role", "user")
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
        "company": company,
        "plan": "Free",
        "status": "Active",
        "reactivationStatus": "Not Requested",
        "deactivatedBy": ""

    })

    return {

        "message": "Signup Successful"

    }


# LOGIN
# LOGIN CHECKS EMAIL AND PASSWORD ONLY
# ROLE, COMPANY AND PLAN COME FROM BACKEND USER DATA

@auth_router.post("/auth/login")
def login(user: dict):

    email = user.get("email")
    password = user.get("password")

    for existing_user in users:

        if (

            existing_user.get("email", "").lower()
            ==
            email.lower()

            and

            existing_user.get("password")
            ==
            password

        ):

            company = normalize_company(
                existing_user.get("company")
            )

            role = existing_user.get(
                "role",
                "user"
            )

            plan = existing_user.get(
                "plan",
                "Free"
            )

            account_status = existing_user.get(
                "status",
                "Active"
            )

            reactivation_status = existing_user.get(
                "reactivationStatus",
                "Not Requested"
            )

            deactivated_by = existing_user.get(
                "deactivatedBy",
                ""
            )

            token = create_access_token(

                data={

                    "email": existing_user.get("email"),
                    "role": role,
                    "company": company,
                    "plan": plan,
                    "status": account_status

                }

            )

            return {

                "message": "Login Successful",
                "email": existing_user.get("email"),
                "name": existing_user.get("name"),
                "role": role,
                "company": company,
                "plan": plan,
                "accountStatus": account_status,
                "reactivationStatus": reactivation_status,
                "deactivatedBy": deactivated_by,
                "token": token

            }

    return {

        "message": "Invalid Credentials"

    }


# GET CURRENT USER
# USED BY NAVBAR TO CHECK LATEST ROLE, COMPANY AND PLAN

@auth_router.get("/auth/current-user")
def get_current_user(
    email: str,
    company: str = "Stackly"
):

    company = normalize_company(company)

    for user in users:

        if (
            user["email"].lower() == email.lower()
            and
            normalize_company(user.get("company")) == company
        ):

            return {
                "email": user["email"],
                "name": user.get("name"),
                "role": user.get("role", "user"),
                "company": normalize_company(
                    user.get("company")
                ),
                "plan": user.get("plan", "Free"),
                "accountStatus": user.get("status", "Active"),
                "reactivationStatus": user.get(
                    "reactivationStatus",
                    "Not Requested"
                ),
                "deactivatedBy": user.get("deactivatedBy", "")
            }

    return {
        "message": "User Not Found"
    }


# UPDATE SUBSCRIPTION PLAN

@auth_router.put("/auth/update-plan")
def update_plan(data: dict):

    email = data.get("email")
    company = normalize_company(
        data.get("company", "Stackly")
    )
    plan = data.get("plan", "Free")

    valid_plans = [
        "Free",
        "Professional",
        "Enterprise"
    ]

    if plan not in valid_plans:

        return {
            "message": "Invalid Plan"
        }

    for user in users:

        if (
            user["email"].lower() == email.lower()
            and
            normalize_company(user.get("company")) == company
        ):

            user["plan"] = plan

            return {
                "message": "Plan Updated Successfully",
                "plan": plan
            }

    return {
        "message": "User Not Found"
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
                ),

                "plan": user.get(
                    "plan",
                    "Free"
                ),

                "status": user.get(
                    "status",
                    "Active"
                ),

                "reactivationStatus": user.get(
                    "reactivationStatus",
                    "Not Requested"
                ),

                "deactivatedBy": user.get(
                    "deactivatedBy",
                    ""
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