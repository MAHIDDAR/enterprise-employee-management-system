import requests


API_URL = "https://jsonplaceholder.typicode.com/users"


def get_all_employees():
    response = requests.get(API_URL)

    employees = response.json()

    formatted_employees = []

    for employee in employees:
        formatted_employees.append({
            "id": employee["id"],
            "name": employee["name"],
            "email": employee["email"],
            "department": employee["company"]["name"],
            "city": employee["address"]["city"],
            "phone": employee["phone"]
        })

    return formatted_employees


def get_employee_by_id(employee_id: int):
    response = requests.get(API_URL)

    employees = response.json()

    for employee in employees:
        if employee["id"] == employee_id:
            return {
                "id": employee["id"],
                "name": employee["name"],
                "email": employee["email"],
                "department": employee["company"]["name"],
                "city": employee["address"]["city"],
                "phone": employee["phone"]
            }

    return {
        "message": "Employee not found"
    }