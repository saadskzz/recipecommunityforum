const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    image_url: { type: String, required: true },
    meal_type: { type: String, required: true },
    dietary_tags: { type: [String], required: true },
    nutritional_info: {type:String}
});
module.exports = mongoose.model('Recipe',recipeSchema)