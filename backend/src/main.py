from fastapi import FastAPI
from backend.src.api import api_router
import uvicorn

app = FastAPI(title="Textbook Generation API", version="1.0.0")

# Include API routes
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Textbook Generation API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)