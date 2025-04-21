"use client";

import ChatBox from "@/components/Chat/ChatBox";
import ChatInput from "@/components/Chat/ChatInput";
import { ChatProvider } from "@/lib/ChatContext";
import Recipes from "@/components/Recipes/Recipes";
import ShoppingList from "@/components/ShoppingList/ShoppingList";
import { ShoppingListProvider } from "@/lib/ShoppingListContext";

export default function Home() {
  return (
    <ChatProvider>
      <ShoppingListProvider>
        <div className="flex flex-col h-screen">
          {/* Top Navigation Bar */}
          <nav className="bg-blue-500 text-white p-4">
            <h1 className="text-xl font-bold">AI Meal Planner</h1>
          </nav>

          {/* Three Column Layout - TODO: stack on small screens */}
          <div className="flex flex-col md:flex-row flex-grow md:overflow-hidden">
            {/* Column 1 */}
            <div className="md:h-full w-full md:w-1/3 flex flex-col p-4 bg-gray-100 md:overflow-y-scroll">
              <ChatBox />
              <ChatInput />
            </div>

            {/* Column 2 */}
            <div className="w-full md:w-1/3 bg-gray-200 overflow-y-scroll">
              <Recipes />
            </div>

            {/* Column 3 */}
            <div className="w-full md:w-1/3 bg-gray-300 overflow-y-scroll">
              <ShoppingList />
            </div>
          </div>
        </div>
      </ShoppingListProvider>
    </ChatProvider>
  );
}
