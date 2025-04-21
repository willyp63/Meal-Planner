"use client";

import { createContext, useState, useContext } from "react";

export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  category?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: string[];
  description: string;
  prepTime?: number;
  cookTime?: number;
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  recipes: Recipe[];
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  isLoading: false,
  recipes: [],
  sendMessage: async () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (role: ChatMessageRole, content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const sendMessage = async (content: string) => {
    try {
      // Add user message to state
      addMessage("user", content);
      setIsLoading(true);

      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content }],
          recipes,
        }),
      });
      const data = await response.json();

      // Add assistant response to state & update recipes
      addMessage("assistant", data.message);
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage(
        "assistant",
        "Sorry, I encountered an error processing your request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, recipes }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
