import os
import sys
from mangum import Mangum

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

# Import the main FastAPI application
from backend.main import app

# Create the Mangum adapter for serverless deployment
# Disable lifespan to prevent issues in serverless environment
handler = Mangum(app, lifespan="off")