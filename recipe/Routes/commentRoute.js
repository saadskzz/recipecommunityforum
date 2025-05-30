import { createComment, getPostComments, deleteComment } from '../Controllers/commentController.js';
import { checkToken } from '../Middlewares/middleware.js';
import express from 'express';

const commentRouter = express.Router();

commentRouter.post('/:postid/createcomment', checkToken, createComment);
commentRouter.get('/postcomments/:postid', checkToken, getPostComments);
commentRouter.delete('/:commentid/deletecomment', checkToken, deleteComment);

export default commentRouter;