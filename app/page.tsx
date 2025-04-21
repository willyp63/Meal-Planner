"use client";

import ChatBox from "@/components/Chat/ChatBox";
import ChatInput from "@/components/Chat/ChatInput";
import { ChatProvider } from "@/lib/ChatContext";

export default function Home() {
  return (
    <ChatProvider>
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">AI Meal Planner</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Chat */}
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md h-[600px]">
              <h2 className="text-xl font-semibold mb-4">
                Chat with AI Assistant
              </h2>
              <ChatBox />
              <ChatInput />
            </div>

            {/* Right column - Recipes & Grocery List */}
            <div className="md:col-span-2">
              {/* Recipes Section */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">My Recipes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Recipe placeholders */}
                  <div className="border rounded-lg p-3 hover:shadow-md transition">
                    <h3 className="font-medium">Sample Recipe</h3>
                    <p className="text-sm text-gray-600">
                      A delicious sample recipe to get started.
                    </p>
                  </div>
                  <div className="border rounded-lg p-3 hover:shadow-md transition">
                    <h3 className="font-medium">Add New Recipe</h3>
                    <p className="text-sm text-gray-600">
                      Create a new recipe with AI assistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grocery List Section */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Grocery List</h2>
                <p className="text-gray-600">
                  Your grocery list will appear here once you&apos;ve selected
                  recipes.
                </p>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
                  Generate Grocery List
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ChatProvider>
  );
}
