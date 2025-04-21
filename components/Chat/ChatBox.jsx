'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/lib/ChatContext';

export default function ChatBox() {
  const { messages, loading } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="border rounded-lg h-[450px] mb-4 p-3 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-gray-500 italic">Start a conversation with your AI assistant...</p>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`mb-3 ${message.role === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 rounded-tr-none'
                  : 'bg-gray-100 rounded-tl-none'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))
      )}
      {loading && (
        <div className="mb-3">
          <div className="inline-block p-2 rounded-lg bg-gray-100 rounded-tl-none">
            <p className="text-gray-500">Thinking...</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
