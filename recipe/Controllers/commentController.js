import Comment from '../Models/CommentModel.js';
import Post from '../Models/PostModel.js';

const createComment = async(req, res) => {
    const author = req.user._id;
    const postid = req.params.postid;
    const { content } = req.body;
    
    const createdComment = new Comment({
        author,
        content,
        post: postid 
    });

    try {
        await createdComment.save();
        res.status(200).json({
            createdComment
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
            const commentData = await Comment.find({ post: postid }).populate('author', 'firstName lastName profilePic');
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

export { createComment, getPostComments };