import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { ChatMessage } from '../../types/chat';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-history">
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>No messages yet. Start a conversation by asking a question!</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.content}
              isUser={msg.role === 'user'}
              timestamp={msg.timestamp}
              confidence={msg.confidence}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatHistory;