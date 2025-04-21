'use client';

import { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const sendMessage = async (content) => {
    try {
      // Add user message to state
      addMessage('user', content);
      setLoading(true);

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content }]
        }),
      });
      const data = await response.json();

      // Add assistant response to state
      addMessage('assistant', data.message);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage('assistant', "Sorry, I encountered an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
