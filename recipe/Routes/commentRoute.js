const { createComment, getPostComments } = require('../Controllers/commentController');
const { checkToken } = require('../Middlewares/middleware');

const commentRouter = require('express').Router();

commentRouter.post('/:postid/createcomment',checkToken,createComment)
commentRouter.get('/postcomments/:postid',getPostComments)

module.exports = commentRouter