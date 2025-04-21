import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Define function schemas for recipe operations
    // const functionSchemas = [
    //   {
    //     name: "createRecipe",
    //     description: "Create a new recipe based on user input",
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         name: { type: "string", description: "Name of the recipe" },
    //         description: { type: "string", description: "Brief description of the recipe" },
    //         ingredients: { 
    //           type: "array", 
    //           items: { 
    //             type: "object",
    //             properties: {
    //               name: { type: "string" },
    //               quantity: { type: "string" },
    //               unit: { type: "string" }
    //             }
    //           }
    //         },
    //         steps: { type: "array", items: { type: "string" } },
    //         prepTime: { type: "number", description: "Preparation time in minutes" },
    //         cookTime: { type: "number", description: "Cooking time in minutes" }
    //       },
    //       required: ["name", "ingredients", "steps"]
    //     }
    //   }
    // ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant specialized in cooking and meal planning. Help users create recipes and plan meals."
        },
        ...messages
      ],
      // tools: functionSchemas.map(schema => ({
      //   type: "function",
      //   function: schema
      // })),
      // tool_choice: "auto",
    });

    // Get the response message
    const responseMessage = response.choices[0].message;

    // Handle function calls if any
    // if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    //   const toolCall = responseMessage.tool_calls[0];
      
    //   if (toolCall.function.name === "createRecipe") {
    //     const recipeData = JSON.parse(toolCall.function.arguments);
        
    //     // In a real app, you would save this to a database
    //     // For now, we'll just return it with the response
        
    //     // Call the LLM again to get a final response
    //     const finalResponse = await openai.chat.completions.create({
    //       model: "gpt-4-turbo",
    //       messages: [
    //         {
    //           role: "system",
    //           content: "You are a helpful AI assistant specialized in cooking and meal planning."
    //         },
    //         ...messages,
    //         responseMessage,
    //         {
    //           role: "function",
    //           name: "createRecipe",
    //           content: JSON.stringify({ success: true, recipe: recipeData })
    //         }
    //       ]
    //     });
        
    //     return Response.json({
    //       message: finalResponse.choices[0].message.content,
    //       toolCall: {
    //         name: "createRecipe",
    //         data: recipeData
    //       }
    //     });
    //   }
    // }

    // If no function calls, just return the response
    return Response.json({ message: responseMessage.content });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return Response.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
