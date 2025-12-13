import os
import random
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

try:
    from src.api.routers import api_router
    from src.auth.routes import router as auth_router
    # Import the RAG service to load textbook content
    from src.services.rag_service import load_textbook_content_from_docs
except ImportError:
    # If the modules don't exist, we'll continue without them
    api_router = None
    auth_router = None
    load_textbook_content_from_docs = None

# Get configuration from environment variables with defaults
API_TITLE = os.getenv("API_TITLE", "Textbook Generation API")
API_DESCRIPTION = os.getenv("API_DESCRIPTION", "API for generating textbooks using AI")
API_VERSION = os.getenv("API_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    debug=DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to the specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers if they exist
if api_router:
    app.include_router(api_router, prefix="/api/v1")
if auth_router:
    app.include_router(auth_router)

TEXT_OPTIONS = [
    "Welcome to the Physical AI & Humanoid Robotics Textbook!",
    "Advanced robotics combines mechanical engineering, electrical engineering, and computer science.",
    "Machine learning algorithms enable robots to adapt to new environments.",
    "Humanoid robots represent one of the most challenging areas in robotics research.",
    "Kinematics and dynamics are fundamental concepts in robot motion planning.",
    "Artificial intelligence is revolutionizing the capabilities of autonomous systems.",
    "Sensor fusion allows robots to perceive their environment accurately.",
    "Control theory provides the mathematical foundation for robotic movement.",
    "Computer vision enables robots to interpret visual information from cameras.",
    "Natural language processing allows humans to interact with robots using speech."
]

@app.get("/")
def read_root():
    return {"message": "Textbook Generation API is running!"}

@app.get("/generate-text")
def generate_text():
    """Generate a random text related to robotics and AI"""
    text = random.choice(TEXT_OPTIONS)
    return {"text": text}

@app.get("/generate-text-multiple")
def generate_text_multiple(count: int = 5):
    """Generate multiple random texts related to robotics and AI"""
    texts = [random.choice(TEXT_OPTIONS) for _ in range(min(count, 10))]  # Limit to 10
    return {"texts": texts}

# Event handler to load textbook content when the application starts
@app.on_event("startup")
async def startup_event():
    if load_textbook_content_from_docs:
        print("Loading textbook content into RAG system...")
        load_textbook_content_from_docs()
        print("Textbook content loaded successfully!")

if __name__ == "__main__":
    import uvicorn
    HOST = os.getenv("API_HOST", "0.0.0.0")
    PORT = int(os.getenv("API_PORT", "3000"))  # Changed default to 3000
    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)