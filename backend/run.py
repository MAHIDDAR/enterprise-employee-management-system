from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base
from app.database.database import engine

# IMPORT MODELS
from app.models.employee_model import Employee
from app.models.company_model import Company
from app.models.audit_log_model import AuditLog
from app.models.invitation_model import Invitation

# IMPORT ROUTES
from app.routes.employee_routes import router
from app.routes.auth_routes import auth_router
from app.routes.request_routes import request_router
from app.routes.audit_routes import audit_router
from app.routes.analytics_routes import analytics_router
from app.routes.invitation_routes import invitation_router


# CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)


app = FastAPI()


# CORS
app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# ROUTES
app.include_router(router)

app.include_router(auth_router)

app.include_router(request_router)

app.include_router(audit_router)

app.include_router(analytics_router)

app.include_router(invitation_router)


@app.get("/")
def home():

    return {

        "message": "Backend Running"

    }