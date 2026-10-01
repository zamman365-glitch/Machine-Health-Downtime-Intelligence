import logging
import psycopg2
from psycopg2 import pool
from fastapi import HTTPException
from app.config import settings

logger = logging.getLogger("machine_health_api")

db_pool: pool.ThreadedConnectionPool = None


def init_db_pool():
    global db_pool
    if db_pool is None or db_pool.closed:
        try:
            db_pool = psycopg2.pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=10,
                host=settings.DB_HOST,
                database=settings.DB_NAME,
                user=settings.DB_USER,
                password=settings.DB_PASSWORD,
                port=settings.DB_PORT,
            )
            logger.info("ThreadedConnectionPool initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize database connection pool: {e}")
            db_pool = None


def close_db_pool():
    global db_pool
    if db_pool is not None and not db_pool.closed:
        db_pool.closeall()
        logger.info("ThreadedConnectionPool closed cleanly.")
        db_pool = None


def check_db_health() -> bool:
    if db_pool is None or db_pool.closed:
        return False
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        return True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        return False
    finally:
        if conn and db_pool and not db_pool.closed:
            db_pool.putconn(conn)


def run_query(query: str, params: tuple = None, fetch_one: bool = False, fetch_all: bool = True):
    if db_pool is None or db_pool.closed:
        init_db_pool()

    if db_pool is None or db_pool.closed:
        raise HTTPException(status_code=500, detail="Database connection pool unavailable.")

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            if fetch_one:
                return cursor.fetchone()
            if fetch_all:
                return cursor.fetchall()
            return None
    except Exception as e:
        logger.exception("Database query failed")
        raise HTTPException(status_code=500, detail="Database error while executing query")
    finally:
        if conn and db_pool and not db_pool.closed:
            db_pool.putconn(conn)


def run_insert(query: str, params: tuple = None):
    if db_pool is None or db_pool.closed:
        init_db_pool()

    if db_pool is None or db_pool.closed:
        raise HTTPException(status_code=500, detail="Database connection pool unavailable.")

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        logger.exception("Database insert failed")
        raise HTTPException(status_code=500, detail="Database error while saving prediction")
    finally:
        if conn and db_pool and not db_pool.closed:
            db_pool.putconn(conn)
