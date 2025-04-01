import mongoose from "mongoose";
const DiscussionForumSchema = new mongoose.Schema({
    discussionCategory:{
        type: String,
        unique:true,
        required: true
    }
    
})
export default mongoose.model('Discussion', DiscussionForumSchema);