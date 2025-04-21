"use client";

import { createContext, useState, useContext, useCallback } from "react";
import { Ingredient, Recipe } from "./ChatContext";

interface ShoppingListContextType {
  isLoading: boolean;
  shoppingList: Ingredient[];
  generateShoppingList: (recipes: Recipe[]) => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType>({
  isLoading: false,
  shoppingList: [],
  generateShoppingList: async () => {},
});

export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateShoppingList = useCallback(async (recipes: Recipe[]) => {
    try {
      setIsLoading(true);
      setShoppingList([]);

      // Call API
      const response = await fetch("/api/shopping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipes }),
      });
      const data = await response.json();
      setShoppingList(data.shoppingList);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{ isLoading, shoppingList, generateShoppingList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export const useShoppingList = () => useContext(ShoppingListContext);
