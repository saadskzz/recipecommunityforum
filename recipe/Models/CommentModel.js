import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Comment', CommentSchema)