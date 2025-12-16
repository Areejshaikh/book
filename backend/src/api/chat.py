from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.src.services.chat_service import ChatService
from backend.src.schemas.chat import ChatInput, ChatResponse
from backend.src.middleware.better_auth import get_current_user, SessionData
import logging


router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=ChatResponse)
async def chat(
    chat_input: ChatInput,
    current_user: SessionData = Depends(get_current_user),  # Require authentication
    chat_service: ChatService = Depends(ChatService)
):
    try:
        # Use the authenticated user's ID from Better Auth
        user_id = int(current_user.user_id) if current_user.user_id.isdigit() else 1  # Fallback to 1 if not a number
        response = await chat_service.process_query(user_id, chat_input.query)
        return ChatResponse(response=response)
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error processing chat request for user {current_user.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while processing chat request")


@router.get("/history/{user_id}")
async def get_chat_history(
    user_id: int,
    current_user: SessionData = Depends(get_current_user),  # Require authentication
    chat_service: ChatService = Depends(ChatService)
):
    try:
        # Verify that the requested user_id matches the authenticated user's ID
        # (or implement admin privileges if needed)
        authenticated_user_id = int(current_user.user_id) if current_user.user_id.isdigit() else 1
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this chat history"
            )

        # Return raw history data without type enforcement to prevent serialization issues
        history = await chat_service.get_chat_history(user_id)
        return history
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error retrieving chat history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while retrieving chat history")