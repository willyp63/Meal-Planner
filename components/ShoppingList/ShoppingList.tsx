"use client";

import { useChat, Ingredient } from "@/lib/ChatContext";
import { useShoppingList } from "@/lib/ShoppingListContext";
import { useEffect } from "react";

interface GroupedIngredients {
  [key: string]: Ingredient[];
}

export default function ShoppingList() {
  const { recipes } = useChat();
  const { shoppingList, isLoading, generateShoppingList } = useShoppingList();

  useEffect(() => {
    if (recipes.length > 0) {
      generateShoppingList(recipes);
    }
  }, [generateShoppingList, recipes]);

  if (shoppingList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">
          {isLoading ? "Loading..." : "No shopping list available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-bold mb-4">Shopping List</h2>
        {Object.entries(
          shoppingList.reduce<GroupedIngredients>((acc, ingredient) => {
            const category = ingredient.category || "Uncategorized";
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(ingredient);
            return acc;
          }, {})
        ).map(([category, ingredients]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {category}
            </h3>
            <ul className="list-disc list-inside">
              {ingredients.map((ingredient, i) => (
                <li key={i} className="text-gray-600">
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
