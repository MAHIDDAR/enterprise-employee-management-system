from fastapi import APIRouter
from datetime import datetime, date

from app.routes.auth_routes import normalize_company
from app.utils.audit_logger import create_audit_log


attendance_router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


attendance_access_requests = []

attendance_records = []

leave_requests = []


# CHECK USER ATTENDANCE ACCESS STATUS

@attendance_router.get("/access-status")
def get_access_status(
    email: str,
    company: str = "Stackly"
):

    company = normalize_company(company)

    for request in attendance_access_requests:

        if (
            request.get("email") == email
            and
            request.get("company") == company
        ):

            return {
                "status": request.get("status"),
                "submittedAt": request.get("submittedAt")
            }

    return {
        "status": "not_requested",
        "submittedAt": ""
    }


# CREATE ATTENDANCE ACCESS REQUEST AUTOMATICALLY

@attendance_router.post("/access-request")
def create_access_request(data: dict):

    email = data.get("email")

    name = data.get("name", email)

    company = normalize_company(
        data.get("company", "Stackly")
    )

    for request in attendance_access_requests:

        if (
            request.get("email") == email
            and
            request.get("company") == company
            and
            request.get("status") == "pending"
        ):

            return {
                "message": "Request Already Pending",
                "status": "pending",
                "submittedAt": request.get("submittedAt")
            }

    submitted_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    new_request = {
        "id": len(attendance_access_requests) + 1,
        "name": name,
        "email": email,
        "company": company,
        "status": "pending",
        "submittedAt": submitted_at
    }

    attendance_access_requests.append(new_request)

    create_audit_log(
        user_name=email,
        action="Attendance Access Requested",
        related_entity=f"user: {email}",
        details="User requested attendance module access",
        company=company
    )

    return {
        "message": "Attendance Access Request Created",
        "status": "pending",
        "submittedAt": submitted_at,
        "data": new_request
    }


# ADMIN GET ATTENDANCE ACCESS REQUESTS

@attendance_router.get("/access-requests")
def get_access_requests(company: str = "Stackly"):

    company = normalize_company(company)

    result = []

    for request in attendance_access_requests:

        if request.get("company") == company:

            result.append(request)

    return result


# ADMIN APPROVE ATTENDANCE ACCESS

@attendance_router.put("/access-request/{request_id}/approve")
def approve_access_request(
    request_id: int,
    data: dict
):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    approved_by = data.get(
        "approvedBy",
        "Admin User"
    )

    for request in attendance_access_requests:

        if (
            request.get("id") == request_id
            and
            request.get("company") == company
        ):

            request["status"] = "approved"

            create_audit_log(
                user_name=approved_by,
                action="Attendance Access Approved",
                related_entity=f"user: {request.get('email')}",
                details="Attendance access approved by admin",
                company=company
            )

            return {
                "message": "Attendance Access Approved"
            }

    return {
        "message": "Request Not Found"
    }


# ADMIN REJECT ATTENDANCE ACCESS

@attendance_router.put("/access-request/{request_id}/reject")
def reject_access_request(
    request_id: int,
    data: dict
):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    rejected_by = data.get(
        "rejectedBy",
        "Admin User"
    )

    for request in attendance_access_requests:

        if (
            request.get("id") == request_id
            and
            request.get("company") == company
        ):

            request["status"] = "rejected"

            create_audit_log(
                user_name=rejected_by,
                action="Attendance Access Rejected",
                related_entity=f"user: {request.get('email')}",
                details="Attendance access rejected by admin",
                company=company
            )

            return {
                "message": "Attendance Access Rejected"
            }

    return {
        "message": "Request Not Found"
    }


# USER CHECK IN

@attendance_router.post("/check-in")
def check_in(data: dict):

    email = data.get("email")

    company = normalize_company(
        data.get("company", "Stackly")
    )

    today = str(date.today())

    current_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    for record in attendance_records:

        if (
            record.get("email") == email
            and
            record.get("company") == company
            and
            record.get("date") == today
        ):

            if record.get("checkIn"):

                return {
                    "message": "Already Checked In"
                }

            record["checkIn"] = current_time
            record["status"] = "Present"

            create_audit_log(
                user_name=email,
                action="Check-In",
                related_entity=f"user: {email}",
                details=f"User checked in at {current_time}",
                company=company
            )

            return {
                "message": "Check In Successful"
            }

    new_record = {
        "id": len(attendance_records) + 1,
        "email": email,
        "company": company,
        "date": today,
        "status": "Present",
        "checkIn": current_time,
        "checkOut": "",
        "workingHours": ""
    }

    attendance_records.append(new_record)

    create_audit_log(
        user_name=email,
        action="Check-In",
        related_entity=f"user: {email}",
        details=f"User checked in at {current_time}",
        company=company
    )

    return {
        "message": "Check In Successful"
    }


# USER CHECK OUT

@attendance_router.post("/check-out")
def check_out(data: dict):

    email = data.get("email")

    company = normalize_company(
        data.get("company", "Stackly")
    )

    today = str(date.today())

    current_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    for record in attendance_records:

        if (
            record.get("email") == email
            and
            record.get("company") == company
            and
            record.get("date") == today
        ):

            if not record.get("checkIn"):

                return {
                    "message": "Please Check In First"
                }

            if record.get("checkOut"):

                return {
                    "message": "Already Checked Out"
                }

            record["checkOut"] = current_time

            try:

                check_in_time = datetime.strptime(
                    record.get("checkIn"),
                    "%Y-%m-%d %H:%M:%S"
                )

                check_out_time = datetime.strptime(
                    current_time,
                    "%Y-%m-%d %H:%M:%S"
                )

                difference = check_out_time - check_in_time

                total_seconds = int(
                    difference.total_seconds()
                )

                hours = total_seconds // 3600

                minutes = (total_seconds % 3600) // 60

                record["workingHours"] = (
                    f"{hours}h {minutes}m"
                )

            except Exception:

                record["workingHours"] = ""

            create_audit_log(
                user_name=email,
                action="Check-Out",
                related_entity=f"user: {email}",
                details=f"User checked out at {current_time}",
                company=company
            )

            return {
                "message": "Check Out Successful"
            }

    return {
        "message": "Please Check In First"
    }


# GET USER ATTENDANCE

@attendance_router.get("/my-attendance")
def get_my_attendance(
    email: str,
    company: str = "Stackly"
):

    company = normalize_company(company)

    today = str(date.today())

    today_attendance = None

    history = []

    for record in attendance_records:

        if (
            record.get("email") == email
            and
            record.get("company") == company
        ):

            history.append(record)

            if record.get("date") == today:

                today_attendance = record

    if today_attendance is None:

        today_attendance = {
            "date": today,
            "status": "Not Marked",
            "checkIn": "",
            "checkOut": "",
            "workingHours": ""
        }

    return {
        "todayAttendance": today_attendance,
        "history": history
    }


# USER SUBMIT LEAVE REQUEST

@attendance_router.post("/leave-request")
def submit_leave_request(data: dict):

    email = data.get("email")

    company = normalize_company(
        data.get("company", "Stackly")
    )

    leave_type = data.get("leaveType", "Vacation")

    start_date = data.get("startDate")

    end_date = data.get("endDate")

    reason = data.get("reason", "")

    submitted_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    new_leave = {
        "id": len(leave_requests) + 1,
        "email": email,
        "company": company,
        "leaveType": leave_type,
        "startDate": start_date,
        "endDate": end_date,
        "reason": reason,
        "status": "pending",
        "submittedAt": submitted_at
    }

    leave_requests.append(new_leave)

    create_audit_log(
        user_name=email,
        action="Leave Request Submitted",
        related_entity=f"user: {email}",
        details=f"Leave requested from {start_date} to {end_date}. Reason: {reason}",
        company=company
    )

    return {
        "message": "Leave Request Submitted",
        "data": new_leave
    }


# USER GET OWN LEAVE REQUESTS

@attendance_router.get("/my-leaves")
def get_my_leaves(
    email: str,
    company: str = "Stackly"
):

    company = normalize_company(company)

    result = []

    for request in leave_requests:

        if (
            request.get("email") == email
            and
            request.get("company") == company
        ):

            result.append(request)

    return result


# ADMIN GET ALL LEAVE REQUESTS

@attendance_router.get("/leave-requests")
def get_leave_requests(company: str = "Stackly"):

    company = normalize_company(company)

    result = []

    for request in leave_requests:

        if request.get("company") == company:

            result.append(request)

    return result


# ADMIN APPROVE LEAVE REQUEST

@attendance_router.put("/leave-request/{request_id}/approve")
def approve_leave_request(
    request_id: int,
    data: dict
):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    approved_by = data.get(
        "approvedBy",
        "Admin User"
    )

    for request in leave_requests:

        if (
            request.get("id") == request_id
            and
            request.get("company") == company
        ):

            request["status"] = "approved"

            create_audit_log(
                user_name=approved_by,
                action="Leave Request Approved",
                related_entity=f"user: {request.get('email')}",
                details=f"Leave request approved for {request.get('email')}",
                company=company
            )

            return {
                "message": "Leave Request Approved"
            }

    return {
        "message": "Leave Request Not Found"
    }


# ADMIN REJECT LEAVE REQUEST

@attendance_router.put("/leave-request/{request_id}/reject")
def reject_leave_request(
    request_id: int,
    data: dict
):

    company = normalize_company(
        data.get("company", "Stackly")
    )

    rejected_by = data.get(
        "rejectedBy",
        "Admin User"
    )

    for request in leave_requests:

        if (
            request.get("id") == request_id
            and
            request.get("company") == company
        ):

            request["status"] = "rejected"

            create_audit_log(
                user_name=rejected_by,
                action="Leave Request Rejected",
                related_entity=f"user: {request.get('email')}",
                details=f"Leave request rejected for {request.get('email')}",
                company=company
            )

            return {
                "message": "Leave Request Rejected"
            }

    return {
        "message": "Leave Request Not Found"
    }