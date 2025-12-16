# Persistent Floating RAG Chatbot with Better Auth - Implementation Guide

## Overview
This implementation provides a production-ready floating RAG chatbot UI that is always visible on the bottom-left of the website. The chatbot enforces authentication using Better Auth before allowing access to chat. After authentication, the chatbot connects to the existing RAG backend and displays grounded answers with citations.

## Features Implemented

### Frontend Components
1. `ChatbotButton.jsx` - Floating chat button always visible at bottom-left
2. `AuthModal.jsx` - Better Auth integration modal with email and social login
3. `ChatWindow.jsx` - Slide-up chat panel with message history
4. `ChatMessage.tsx` - Components for displaying user and AI messages
5. `ChatInput.tsx` - Enhanced text input with auto-resize functionality
6. `AuthContext.tsx` - Global authentication state management
7. `authClient.js` - Better Auth client configuration
8. `authService.js` - Service layer for managing Better Auth operations
9. `chatAPI.js` - Service for connecting to RAG backend

### Backend Changes
1. `better_auth.py` - Custom middleware to verify Better Auth tokens
2. `chat.py` - Updated chat endpoint to require authentication
3. All chat endpoints now require valid Better Auth tokens

## How to Run and Test

### Prerequisites
- Node.js v18+ installed
- Python 3.8+ installed
- Access to the RAG backend (Qdrant + Cohere pipeline)

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   npm install better-auth @better-auth/client @better-auth/react
   ```

2. Set up environment variables in `.env`:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

3. Run the Docusaurus app:
   ```bash
   npm run start
   ```

### Backend Setup
1. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```
   SECRET_KEY=your-secret-key-here
   BETTER_AUTH_SECRET=your-better-auth-secret-here
   QDRANT_URL=your-qdrant-url
   QDRANT_PORT=6333
   COHERE_API_KEY=your-cohere-api-key
   ```

3. Run the backend server:
   ```bash
   python main.py
   ```

## Testing the Implementation

### 1. Authentication Flow
- Navigate to the website
- Click the floating chat icon at bottom-left
- Verify the AuthModal appears when not authenticated
- Test email and social login options
- Verify the chat window opens after successful authentication

### 2. Chat Functionality
- After authentication, ensure the chat window opens
- Type a question related to the textbook content
- Verify the AI provides a response with sources/citations
- Test the loading indicator and error states
- Verify message history is maintained

### 3. Security
- Try accessing `/api/v1/chat` endpoint without auth token - should return 401
- Verify that only authenticated users can access chat functionality
- Test that chat history is properly restricted to the authenticated user

## Architecture

### Frontend Architecture
- **Global State Management**: AuthContext provides authentication state across the app
- **Component Hierarchy**:
  - Layout (theme override) includes ChatbotButton
  - ChatbotButton shows AuthModal if not authenticated, ChatWindow if authenticated
  - AuthModal handles Better Auth integration
  - ChatWindow manages the chat experience
- **Service Layer**:
  - authService.js: abstracts Better Auth operations
  - chatAPI.js: handles communication with backend

### Backend Architecture
- **Authentication Middleware**: Custom JWT verification for Better Auth tokens
- **Protected Endpoints**: All chat endpoints require authentication
- **RAG Integration**: Uses existing Qdrant + Cohere pipeline

## Key Implementation Details

### Better Auth Integration
- Uses @better-auth/client for frontend authentication
- Handles both email and social login providers
- Properly manages session state and tokens

### RAG Backend Integration
- `/api/v1/chat` endpoint accepts user queries
- Requires Bearer token in Authorization header
- Returns responses with citations to source materials

### User Experience
- Floating chat button always visible
- Smooth animations and transitions
- Loading states and error handling
- Responsive design for all screen sizes

## Files Modified/Added
- Frontend:
  - src/contexts/AuthContext.tsx
  - src/services/authClient.js
  - src/services/authService.js
  - src/components/AuthModal.jsx
  - src/components/ChatInput.tsx
  - src/components/ChatMessage.tsx
  - src/components/ChatWindow.jsx
  - src/components/ChatbotButton.jsx
  - src/components/chatAPI.js
  - src/theme/Layout.tsx
  - src/styles/ChatWindow.css
- Backend:
  - src/middleware/better_auth.py
  - src/api/chat.py

## Configuration Notes
- The Better Auth client must be configured with your backend URL
- Ensure the SECRET_KEY and BETTER_AUTH_SECRET match between frontend and backend
- The backend URL is configured via REACT_APP_API_BASE_URL environment variable