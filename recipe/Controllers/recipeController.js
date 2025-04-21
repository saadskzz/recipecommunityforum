import Recipe from '../Models/RecipeModel.js';
import { createRecipeResponse } from '../services/AzureService.js';
import { createApi } from 'unsplash-js';

const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });
const createRecipe = async (req, res) => {
    try {
        const { name } = req.body;
       const response = await createRecipeResponse(name)
       const recipeData = response;
       let imageUrl;
        const specificSearch = await unsplash.search.getPhotos({ query: recipeData.title, perPage: 1 });
        if (specificSearch.response && specificSearch.response.results.length > 0) {
            imageUrl = specificSearch.response.results[0].urls.regular;
        } else {
            // Fallback to meal_type if no image is found for the title
            const genericSearch = await unsplash.search.getPhotos({ query: recipeData.meal_type, perPage: 1 });
            if (genericSearch.response && genericSearch.response.results.length > 0) {
                imageUrl = genericSearch.response.results[0].urls.regular;
            } else {
                // Use a default image if no results are found
                imageUrl = 'https://example.com/default_recipe.jpg'; // Replace with a real default image URL
            }
        }
        recipeData.image_url = imageUrl;
        const recipe = new Recipe({
            user: req.user._id, 
            title:response.title,
            description:response.description,
            ingredients:response.ingredients,
            instructions:response.instructions,
            image_url:response.image_url,
            meal_type:response.meal_type,
            dietary_tags:response.dietary_tags,
            nutritional_info:response.nutritional_info
        });

        const savedRecipe = await recipe.save();
        res.status(201).json({data : savedRecipe});
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('user', 'name email'); 
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findById(id).populate('user', 'name email');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        await Recipe.findByIdAndDelete(id);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
}

// New controller method to get recipes of the logged in user
const getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
    }
};

export { createRecipe, getRecipes, getRecipeById, getUserRecipes,deleteRecipe };
