const { getRecipes, getRecipeById, createRecipe } = require('../Controllers/recipeController');
const { checkToken } = require('../Middlewares/middleware');
const upload = require('../Middlewares/multerConfig');

const recipeRouter = require('express').Router();

recipeRouter.get('/getrecipes',getRecipes)
recipeRouter.get('/getonerecipe/:id',getRecipeById)
recipeRouter.post('/createrecipe',upload.single('image_url'),checkToken,createRecipe);
module.exports = recipeRouter