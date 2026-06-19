from fastapi import APIRouter

from datetime import datetime, date

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


security_events = []

security_alerts = []


# NORMALIZE COMPANY NAME

def normalize_company(company):

    if not company:

        return "Stackly"

    if company.lower() == "tcs":

        return "TCS"

    if company.lower() == "stackly":

        return "Stackly"

    return company.strip()


# FIND USER BY EMAIL

def find_user_by_email(email):

    if not email:

        return None

    for user in users:

        if user.get("email", "").lower() == email.lower():

            return user

    return None


# GET RISK LEVEL

def get_risk_level(score):

    if score >= 100:

        return "Critical Risk"

    if score >= 60:

        return "High Risk"

    if score >= 30:

        return "Medium Risk"

    return "Low Risk"


# CREATE SECURITY EVENT

def create_security_event(
    email,
    company,
    event_type,
    details,
    risk_points,
    severity="Medium"
):

    company = normalize_company(company)

    user = find_user_by_email(email)

    user_name = email

    if user:

        user_name = user.get("name", email)

    new_event = {
        "id": len(security_events) + 1,
        "email": email,
        "userName": user_name,
        "company": company,
        "eventType": event_type,
        "details": details,
        "riskPoints": risk_points,
        "severity": severity,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "date": str(date.today())
    }

    security_events.append(new_event)

    return new_event


# CREATE FAILED LOGIN ALERT

def create_failed_login_alert(email, company):

    company = normalize_company(company)

    user = find_user_by_email(email)

    if user:

        company = normalize_company(user.get("company"))

    failed_attempts = 0

    for event in security_events:

        if (
            event.get("email") == email
            and
            normalize_company(event.get("company")) == company
            and
            event.get("eventType") == "Failed Login"
        ):

            failed_attempts += 1

    attempt_number = failed_attempts + 1

    risk_points = 5

    severity = "Medium"

    if attempt_number >= 5:

        severity = "High"

    event = create_security_event(
        email=email,
        company=company,
        event_type="Failed Login",
        details=f"Failed login attempt for {email} (attempt {attempt_number})",
        risk_points=risk_points,
        severity=severity
    )

    new_alert = {
        "id": len(security_alerts) + 1,
        "eventId": event.get("id"),
        "email": email,
        "userName": event.get("userName"),
        "company": company,
        "alertType": "Failed Login",
        "message": f"Failed login attempt for {email} (attempt {attempt_number})",
        "riskPoints": risk_points,
        "severity": severity,
        "status": "open",
        "createdAt": event.get("createdAt"),
        "date": event.get("date")
    }

    security_alerts.append(new_alert)


# CALCULATE USER RISK SCORE

def calculate_user_risk(email, company):

    company = normalize_company(company)

    score = 0

    failed_login_count = 0

    unauthorized_access_count = 0

    for event in security_events:

        if (
            event.get("email") == email
            and
            normalize_company(event.get("company")) == company
        ):

            if event.get("eventType") == "Failed Login":

                failed_login_count += 1
                score += 5

            if event.get("eventType") == "Unauthorized Page Access":

                unauthorized_access_count += 1
                score += 15

    return {
        "email": email,
        "failedLoginCount": failed_login_count,
        "unauthorizedAccessCount": unauthorized_access_count,
        "riskScore": score,
        "riskLevel": get_risk_level(score)
    }


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
# FAILED LOGIN CREATES SECURITY ALERT

@auth_router.post("/auth/login")
def login(user: dict):

    email = user.get("email")
    password = user.get("password")

    request_company = normalize_company(
        user.get("company", "Stackly")
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

    failed_user = find_user_by_email(email)

    alert_company = request_company

    if failed_user:

        alert_company = normalize_company(
            failed_user.get("company")
        )

    create_failed_login_alert(
        email=email,
        company=alert_company
    )

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


# ADD UNAUTHORIZED PAGE ACCESS EVENT

@auth_router.post("/auth/security/unauthorized-access")
def unauthorized_page_access(data: dict):

    email = data.get("email")
    company = normalize_company(
        data.get("company", "Stackly")
    )
    page = data.get("page", "Unknown Page")

    create_security_event(
        email=email,
        company=company,
        event_type="Unauthorized Page Access",
        details=f"Unauthorized page access attempt: {page}",
        risk_points=15,
        severity="High"
    )

    return {
        "message": "Unauthorized Access Recorded"
    }


# GET SECURITY SUMMARY FOR ADMIN DASHBOARD

@auth_router.get("/auth/security-summary")
def get_security_summary(company: str = "Stackly"):

    company = normalize_company(company)

    today = str(date.today())

    company_users = []

    for user in users:

        if normalize_company(user.get("company")) == company:

            company_users.append(user)

    today_alerts = []

    open_alerts = []

    resolved_alerts = []

    critical_alerts = []

    for alert in security_alerts:

        if normalize_company(alert.get("company")) == company:

            if alert.get("date") == today:

                today_alerts.append(alert)

            if alert.get("status") == "open":

                open_alerts.append(alert)

            if alert.get("status") == "resolved":

                resolved_alerts.append(alert)

            user_risk = calculate_user_risk(
                alert.get("email"),
                company
            )

            if user_risk.get("riskScore") >= 100:

                critical_alerts.append(alert)

    top_risk_users = []

    for user in company_users:

        risk_data = calculate_user_risk(
            user.get("email"),
            company
        )

        top_risk_users.append({
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "company": company,
            "riskScore": risk_data.get("riskScore"),
            "riskLevel": risk_data.get("riskLevel"),
            "failedLoginCount": risk_data.get("failedLoginCount"),
            "unauthorizedAccessCount": risk_data.get("unauthorizedAccessCount")
        })

    top_risk_users.sort(
        key=lambda item: item.get("riskScore"),
        reverse=True
    )

    company_risk_score = 0

    for item in top_risk_users:

        company_risk_score += item.get("riskScore", 0)

    recent_events = []

    for event in security_events:

        if normalize_company(event.get("company")) == company:

            recent_events.append(event)

    recent_events.sort(
        key=lambda item: item.get("id"),
        reverse=True
    )

    return {
        "cards": {
            "securityAlertsToday": len(today_alerts),
            "openAlerts": len(open_alerts),
            "resolvedAlerts": len(resolved_alerts),
            "criticalAlerts": len(critical_alerts)
        },
        "topRiskUsers": top_risk_users[:5],
        "topRiskCompanies": [
            {
                "company": company,
                "riskScore": company_risk_score,
                "riskLevel": get_risk_level(company_risk_score),
                "usersTracked": len(company_users)
            }
        ],
        "recentEvents": recent_events[:10]
    }


# RESOLVE SECURITY ALERT

@auth_router.put("/auth/security-alert/{alert_id}/resolve")
def resolve_security_alert(alert_id: int):

    for alert in security_alerts:

        if alert.get("id") == alert_id:

            alert["status"] = "resolved"

            return {
                "message": "Security Alert Resolved"
            }

    return {
        "message": "Security Alert Not Found"
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

                "message": "Password Updated Successfully"

            }

    return {

        "message": "User Not Found"

    }