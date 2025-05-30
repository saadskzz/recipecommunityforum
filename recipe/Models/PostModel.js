import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
   // title, ingredients, instructions, recipeimg
   user:{
type: mongoose.Schema.Types.ObjectId,
 ref:'User'
   },
title:{
    type: String,
    required:true
},
ingredients:{
    type: [String],
    default: []
},
instructions: {
    type: String,
    default: ''
},
 recipeimg :{
    type :String
 }
 ,
 likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 likesCount: { type: Number, default: 0 },
 discussionCategory:{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Discussion',
   required: true
 },
 unlikes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 unlikesCount: { type: Number, default: 0 },
 createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', PostSchema);