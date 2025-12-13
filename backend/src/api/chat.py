from fastapi import APIRouter, Depends, HTTPException
from typing import List
from backend.src.services.chat_service import ChatService
from backend.src.schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse
import logging


router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=ChatResponse)
def chat(
    chat_request: ChatRequest,
    chat_service: ChatService = Depends(ChatService)
):
    try:
        response = chat_service.process_query(chat_request.user_id, chat_request.query)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(f"Error processing chat request for user {chat_request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while processing chat request")


@router.get("/history/{user_id}", response_model=List[ChatHistoryResponse])
def get_chat_history(
    user_id: int,
    chat_service: ChatService = Depends(ChatService)
):
    try:
        history = chat_service.get_chat_history(user_id)
        return history
    except Exception as e:
        logger.error(f"Error retrieving chat history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while retrieving chat history")