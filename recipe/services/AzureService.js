import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential }  from "@azure/core-auth";
const client = new ModelClient("https://neurodude-gpt.openai.azure.com/openai/deployments/gpt-4o-mini", new AzureKeyCredential(process.env.AZURE_AI_SECRET));

const createRecipeResponse = async (recipeName) => {
   
    const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role:"system", content: `
                You are a recipe assistant. When a user provides a recipe name, respond with a JSON object containing the following fields:  
  
- title: { type: String, required: true }  
- description: { type: String, required: true }  
- ingredients: { type: [String], required: true }  
- instructions: { type: String, required: true }  
- image_url: { type: String, required: true }  
- meal_type: { type: String, required: true }  
- dietary_tags: { type: [String], required: true }  
- nutritional_info: { type: String }  
  
Make sure to provide meaningful values for each field based on the recipe name provided by the user. If the recipe is not found, indicate that in the JSON output, ensuring the required fields are still present.
Make sure there are no markdown formatting of any kind in response.
Response should be parseable by JSON Object.
                ` },
            { role:"user", content: recipeName }
          ],
          max_tokens: 4096,
          temperature: 1,
          top_p: 1,
          model: "gpt-4o-mini"
        }
      });
      return JSON.parse(response.body.choices[0].message.content);
}
export { createRecipeResponse };