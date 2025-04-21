"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useChat } from "@/lib/ChatContext";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useChat();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <textarea
        value={input}
        onChange={handleChange}
        className="flex-grow border rounded-t-lg p-2 min-h-[100px] resize-none"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-b-lg ${
          isLoading ? "bg-blue-300" : "bg-blue-500"
        } text-white`}
        disabled={isLoading}
      >
        Send
      </button>
    </form>
  );
}
