"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/lib/ChatContext";
import ReactMarkdown from "react-markdown";

export default function ChatBox() {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow mb-4 p-3 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-gray-500 italic">
          Start a conversation with your AI assistant...
        </p>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`mb-3`}>
            <div
              className={`p-2 rounded-lg ${
                message.role === "user"
                  ? "ml-8 bg-blue-100"
                  : "mr-8 bg-gray-200"
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 my-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 my-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    p: ({ children }) => <p className="my-2">{children}</p>,
                    code: ({ children }) => (
                      <code className="bg-gray-200 rounded px-1 py-0.5">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-200 rounded p-2 my-2 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))
      )}
      {isLoading && (
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
