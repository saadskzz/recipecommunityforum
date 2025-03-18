const mongoose = require('mongoose')
const DiscussionForumSchema = new mongoose.Schema({
    discussionCategory:{
        type:String,
        required:true
    }
    
})
module.exports = mongoose.model('Discussion',DiscussionForumSchema)