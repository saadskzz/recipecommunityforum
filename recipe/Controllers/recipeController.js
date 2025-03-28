const Recipe = require('../Models/RecipeModel');

const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, meal_type, dietary_tags, nutritional_info } = req.body;
        const image_url = req.file ? req.file.path : null;

        const recipe = new Recipe({
            user: req.user._id, 
            title,
            description,
            ingredients,
            instructions,
            image_url,
            meal_type,
            dietary_tags,
            nutritional_info
        });

        const savedRecipe = await recipe.save();
        res.status(201).json(savedRecipe);
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

module.exports = {
    createRecipe,
    getRecipes,
    getRecipeById
};
