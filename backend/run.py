from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.employee_routes import router
from app.routes.auth_routes import auth_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# EMPLOYEE ROUTES
app.include_router(router)

# AUTH ROUTES
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }