import React, { useState, useEffect } from 'react';
import '../styles/ChatbotButton.css';
import '../styles/ChatWindow.css'; // Also import chat window styles
import { authService } from '../services/authService';
import ChatWindow from './ChatWindow';
import AuthModal from './AuthModal';

const ChatbotButton = ({ position = "bottom-left", size = "large", backendUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuthStatus();
  }, []);

  const handleClick = async () => {
    // If not authenticated, show auth modal
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // If authenticated, toggle chat window
    if (isOpen) {
      // Trigger close animation
      setIsClosing(true);
      // Reset the closing state after animation completes
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300); // Match the duration of the CSS animation
    } else {
      setIsOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setIsOpen(true); // Open chat window after successful auth
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError('Error logging out. Please try again.');
    }
  };

  const handleWindowClose = () => {
    // Trigger close animation
    setIsClosing(true);
    // Reset the closing state after animation completes
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match the duration of the CSS animation
  };

  const buttonPositionClass = `chatbot-button-${position}`;
  const buttonSizeClass = `chatbot-button-${size}`;

  return (
    <div className="chatbot-container">
      {isOpen && isAuthenticated && !isClosing && (
        <ChatWindow
          onClose={handleWindowClose}
          backendUrl={backendUrl}
          onLogout={handleLogout}
        />
      )}

      {isClosing && (
        <div className="chat-window-container slide-down">
          <ChatWindow
            onClose={handleWindowClose}
            backendUrl={backendUrl}
            onLogout={handleLogout}
          />
        </div>
      )}

      <button
        className={`chatbot-button ${buttonPositionClass} ${buttonSizeClass} ${isOpen ? 'active' : ''}`}
        onClick={handleClick}
        aria-label={isOpen ? "Close chat" : "Open chat with AI assistant"}
        title="Chat with AI textbook assistant"
        tabIndex="0"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        💬
      </button>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onError={(error) => setAuthError(error)}
        />
      )}

      {authError && (
        <div className="auth-error-message" role="alert" aria-live="assertive">
          {authError}
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;