'use client';

import { useState } from 'react';
import { useChat } from '@/lib/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow border rounded-l-lg p-2"
        placeholder="Type your message..."
        disabled={loading}
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-r-lg ${
          loading ? 'bg-blue-300' : 'bg-blue-500'
        } text-white`}
        disabled={loading}
      >
        Send
      </button>
    </form>
  );
}
