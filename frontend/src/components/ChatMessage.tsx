import React from 'react';

interface MessageProps {
  text: string;
  timestamp: Date;
  sources?: string[];
}

export const UserMessage: React.FC<MessageProps> = ({ text, timestamp }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[80%]">
        <p>{text}</p>
        <p className="text-xs opacity-70 mt-1 text-right">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
};

export const AssistantMessage: React.FC<MessageProps> = ({ text, timestamp, sources }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] border border-gray-200">
        <div className="flex items-start">
          <span className="mr-2">🤖</span>
          <span className="text-gray-800">{text}</span>
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-1">Sources:</p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              {sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};