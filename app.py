"""
Machine Health API Entrypoint
Re-exports `app` from `app.main` to support both `uvicorn app:app --reload`
and `uvicorn app.main:app --reload`.
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)