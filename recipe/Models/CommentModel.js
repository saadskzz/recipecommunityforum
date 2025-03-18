const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', CommentSchema)