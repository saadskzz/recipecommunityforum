import Comment from '../Models/CommentModel.js';
import Post from '../Models/PostModel.js';

const createComment = async(req, res) => {
    const author = req.user._id;
    const postid = req.params.postid;
    const { content, parentId } = req.body;
    
    const createdComment = new Comment({
        author,
        content,
        post: postid,
        parentId: parentId || null
    });

    try {
        await createdComment.save();
        
        // Populate author data before sending the response
        const populatedComment = await Comment.findById(createdComment._id)
            .populate('author', 'firstName lastName profilePic');
        
        res.status(200).json({
            createdComment: populatedComment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message 
        });
    }
}

const getPostComments = async(req, res) => {
    const postid = req.params.postid;
    try {
        if (postid) {
            const commentData = await Comment.find({ post: postid })
                .populate('author', 'firstName lastName profilePic')
                .sort({ createdAt: 1 }); // Sort by creation date
            
            return res.status(200).json({
                status: 'success',
                commentData
            });
        } else {
            return res.status(400).json({
                message: 'post not found or deleted by author'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

const deleteComment = async(req, res) => {
    const { commentid } = req.params;
    const userId = req.user._id;
    
    try {
        const comment = await Comment.findById(commentid);
        
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }
        
        // Check if the user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Not authorized to delete this comment'
            });
        }
        
        // Delete this comment and all its replies
        await Comment.deleteMany({ 
            $or: [
                { _id: commentid },
                { parentId: commentid }
            ]
        });
        
        return res.status(200).json({
            status: 'success',
            message: 'Comment and all replies deleted successfully'
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

export { createComment, getPostComments, deleteComment };