import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.db import init_db_pool, close_db_pool
from app.routers import health, predict, dashboard

# Logging configuration
logger = logging.getLogger("machine_health_api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize ThreadedConnectionPool
    init_db_pool()
    yield
    # Shutdown: Close database pool cleanly
    close_db_pool()


app = FastAPI(
    title="Machine Health API",
    description="Predictive maintenance failure risk and cost estimation API service",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing and logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - {duration_ms}ms")
    return response


# Validation error handler formatting
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg_parts = []
    for err in errors:
        loc = " -> ".join([str(p) for p in err.get("loc", []) if p != "body"])
        msg = err.get("msg", "Invalid value")
        msg_parts.append(f"{loc}: {msg}" if loc else msg)
    
    detail_msg = "; ".join(msg_parts) if msg_parts else "Validation error on request body."
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": detail_msg},
    )


# General uncaught exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server exception on {request.url.path}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error. Please contact system administrator."},
    )


# Include Routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(dashboard.router)
