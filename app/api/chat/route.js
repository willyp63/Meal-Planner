import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPrompt = (recipes) => {
  return `You are a knowledgeable and curious cooking assistant that helps users create and manage recipes tailored to their specific needs, preferences, and constraints. The user currently has the following recipes: ${JSON.stringify(
    recipes
  )}.

IMPORTANT GUIDELINES:
1. DO NOT output full recipes in the conversation. All recipes must be created, updated, or deleted using the appropriate function calls only.
2. Remember that users can see the recipes you create through the function calls - you don't need to repeat recipe details in the conversation.
3. Be naturally curious and ask targeted questions to understand the user's needs better. This includes:
   - Dietary restrictions or preferences (vegetarian, vegan, gluten-free, etc.)
   - Ingredient preferences or restrictions (likes, dislikes, allergies)
   - Time constraints for preparation and cooking
   - Skill level and available kitchen equipment
   - Budget considerations and ingredient availability
   - Flavor preferences (spicy, sweet, savory, etc.)
   - Nutritional goals (high-protein, low-carb, etc.)
   - Serving size and portion requirements
   - Cultural or traditional preferences

4. Start with essential questions, but ask follow-up questions as needed to refine your understanding.
5. When the user asks for a new recipe, gather enough information before creating it.
6. When modifying recipes, confirm which aspects the user wants to change.
7. Keep the conversation focused on understanding the user's needs and preferences rather than explaining cooking techniques or ingredients (unless specifically asked).

Remember: Your goal is to create personalized recipes that perfectly match the user's situation through thoughtful questioning and efficient use of function calls.`;
};

const generateId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const CREATE_FUNCTION = {
  function: (recipes, newRecipeData) => {
    return {
      returnValue: { success: true, recipe: newRecipeData },
      recipes: [{ ...newRecipeData, id: generateId() }, ...recipes],
    };
  },
  schema: {
    name: "createRecipe",
    description: "Create a new recipe based on user input",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the recipe" },
        description: {
          type: "string",
          description: "Brief description of the recipe",
        },
        ingredients: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              quantity: { type: "string" },
              unit: { type: "string" },
            },
          },
        },
        steps: { type: "array", items: { type: "string" } },
        prepTime: {
          type: "number",
          description: "Preparation time in minutes",
        },
        cookTime: { type: "number", description: "Cooking time in minutes" },
      },
      required: ["name", "ingredients", "steps"],
    },
  },
};

const DELETE_FUNCTION = {
  function: (recipes, deleteData) => {
    const { id } = deleteData;
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);

    if (recipeIndex === -1) {
      return {
        returnValue: { success: false, error: "Recipe not found" },
        recipes: recipes,
      };
    }

    const deletedRecipe = recipes[recipeIndex];
    const newRecipes = recipes.filter((recipe) => recipe.id !== id);

    return {
      returnValue: { success: true, recipe: deletedRecipe },
      recipes: newRecipes,
    };
  },
  schema: {
    name: "deleteRecipe",
    description: "Delete an existing recipe",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the recipe to delete" },
      },
      required: ["id"],
    },
  },
};

const FUNCTIONS = [CREATE_FUNCTION, DELETE_FUNCTION];

async function processMessages(messages, recipes) {
  console.log("current prompt:", getPrompt(recipes));
  console.log("current recipes:", recipes);
  console.log("current messages:", messages);

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: getPrompt(recipes),
      },
      ...messages,
    ],
    tools: FUNCTIONS.map(({ schema }) => ({
      type: "function",
      function: schema,
    })),
    tool_choice: "auto",
  });

  console.log("Received response from OpenAI:", response.choices[0].message);

  const responseMessage = response.choices[0].message;

  if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    let currentRecipes = recipes;
    let newMessages = [...messages, responseMessage];

    // Process each tool call in sequence
    for (const toolCall of responseMessage.tool_calls) {
      console.log("Processing tool call:", {
        name: toolCall.function.name,
        arguments: toolCall.function.arguments,
      });

      const toolFunction = FUNCTIONS.find(
        (f) => f.schema.name === toolCall.function.name
      );
      const { returnValue, recipes: updatedRecipes } = toolFunction.function(
        currentRecipes,
        JSON.parse(toolCall.function.arguments)
      );

      console.log("Tool execution result:", {
        function: toolCall.function.name,
        returnValue,
        newRecipeCount: updatedRecipes.length,
      });

      // Add the tool response to messages
      newMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(returnValue),
      });

      // Update recipes for the next tool call
      currentRecipes = updatedRecipes;
    }

    // Recursively process the new messages with the final state of recipes
    return processMessages(newMessages, currentRecipes);
  }

  console.log("Final response:", responseMessage.content);
  return { message: responseMessage.content, recipes };
}

export async function POST(req) {
  try {
    const { messages, recipes } = await req.json();
    console.log(
      "Received request with messages:",
      messages.length,
      "and recipes:",
      recipes.length
    );

    const { message: newMessage, recipes: newRecipes } = await processMessages(
      messages,
      recipes
    );

    console.log(
      "Sending response with message and",
      newRecipes.length,
      "recipes"
    );
    return Response.json({ message: newMessage, recipes: newRecipes });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return Response.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
