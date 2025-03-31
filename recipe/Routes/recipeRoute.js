import { getRecipes, getRecipeById, createRecipe, getUserRecipes } from '../Controllers/recipeController.js';
import { checkToken } from '../Middlewares/middleware.js';
import upload from '../Middlewares/multerConfig.js';
import express from 'express';

const recipeRouter = express.Router();

recipeRouter.get('/getrecipes', checkToken, getRecipes);
recipeRouter.get('/getonerecipe/:id', checkToken, getRecipeById);
recipeRouter.post('/createrecipe', checkToken, createRecipe);
recipeRouter.get('/getusersrecipe', checkToken, getUserRecipes);

export default recipeRouter;