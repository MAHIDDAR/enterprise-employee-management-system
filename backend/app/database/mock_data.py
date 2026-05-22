import requests


API_URL = "https://jsonplaceholder.typicode.com/users"


def fetch_employee_data():
    response = requests.get(API_URL)

    if response.status_code == 200:
        return response.json()

    return []