import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPrompt = (ingredients) => {
  return `You are a smart ingredient processor that takes a list of recipe ingredients and:
1) Combines similar ingredients
2) Standardizes measurements
3) Categorizes each ingredient by supermarket section

IMPORTANT GUIDELINES:
1. Your output must be ONLY a valid JSON object with a single "shoppingList" property containing an array of ingredient objects.
2. The exact output format must be: {"shoppingList": [ingredient objects]}
3. Each ingredient object must have exactly these four properties:
   - "name": string (the ingredient name)
   - "quantity": string (the amount, as a string even if numeric)
   - "unit": string (the measurement unit, or "whole" for counted items)
   - "category": string (the supermarket section)
4. Example output:
   {"shoppingList":[
     {"name":"yellow onion","quantity":"2","unit":"whole","category":"Produce"},
     {"name":"boneless chicken thighs","quantity":"1","unit":"pound","category":"Meat & Seafood"}
   ]}

5. CRITICAL - INGREDIENT COMPLETENESS:
   - EVERY ingredient from the input list MUST appear in your output
   - NEVER add ingredients that weren't in the input list
   - If you're unsure about an ingredient, include it with its original description
   - For verification, mentally check off each input ingredient as you add it to the output

6. When combining ingredients:
   - Combine the same ingredient with different descriptions (e.g., "diced onion" and "chopped onion")
   - Convert measurements to a common unit when possible
   - If measurements can't be combined cleanly, keep separate entries with clear distinctions
   - Keep different forms of ingredients separate when cooking preparation matters (e.g., "sliced tomatoes" vs "crushed tomatoes")

7. For ingredient names:
   - Use specific descriptors when provided (e.g., "yellow onion" rather than just "onion")
   - Include characteristics relevant for shopping (e.g., "boneless chicken thighs")
   - Remove preparation instructions (e.g., "diced", "chopped", "minced")

8. For measurements:
   - ALWAYS ROUND UP to common purchasable units:
     * Round up to nearest whole number for counted items (e.g., 1.5 apples → 2 apples)
     * Round up to nearest common fraction for measurements (1/2, 1/4, 3/4, 1)
     * Avoid tiny fractions like 1/16 or 1/8 - round up to 1/4 or 1/2
     * For butter, round to nearest 1/4 cup or 4 tablespoons (common stick divisions)
     * Round all ingredients to quantities you would normally purchase in stores
   - Use "whole" as the unit for counted items (e.g., "2" "whole" for 2 eggs)
   - Use common kitchen units (cups, tablespoons, teaspoons, ounces, pounds)
   - Choose the most appropriate unit size (e.g., cups for larger volumes, teaspoons for smaller)

9. Categorize ingredients using ONLY these supermarket categories:
   - "Produce" (fruits, vegetables, fresh herbs)
   - "Meat & Seafood" (all animal proteins)
   - "Dairy & Eggs" (milk, cheese, yogurt, eggs)
   - "Bakery" (bread, rolls, cakes, pastries)
   - "Pantry" (grains, pasta, canned goods, baking supplies, oils, vinegars)
   - "Spices & Seasonings" (dried herbs, spices, salt, pepper, seasoning blends)
   - "Frozen" (frozen vegetables, fruits, prepared foods)
   - "Beverages" (juice, soda, alcohol, water)
   - "International" (specialty ethnic ingredients)
   - "Condiments" (sauces, dressings, spreads)
   - "Uncategorized" (for anything that doesn't fit above)

The list of ingredients to process is: ${JSON.stringify(ingredients)}`;
};

export async function POST(req) {
  try {
    const { recipes } = await req.json();
    const allIngredients = recipes.flatMap((recipe) => recipe.ingredients);
    console.log("current prompt:", getPrompt(recipes));
    console.log("current recipes:", recipes);
    console.log("current ingredients:", allIngredients);

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: getPrompt(allIngredients),
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseMessage = response.choices[0].message;
    console.log("Text response:", responseMessage.content);
    // TODO: catch parsing errors
    const { shoppingList } = JSON.parse(responseMessage.content);
    console.log("Parsed shopping list:", shoppingList);
    return Response.json({ shoppingList });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return Response.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
