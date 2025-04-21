"use client";

import { useChat } from "@/lib/ChatContext";

export default function Recipes() {
  const { recipes } = useChat();

  if (recipes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No recipes available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-4">{recipe.name}</h2>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          <div className="flex gap-4 mb-4 text-sm text-gray-500">
            {recipe.prepTime && (
              <span>Prep Time: {recipe.prepTime} minutes</span>
            )}
            {recipe.cookTime && (
              <span>Cook Time: {recipe.cookTime} minutes</span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="text-gray-600">
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Steps:</h3>
              <ol className="list-decimal list-inside">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="text-gray-600">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
