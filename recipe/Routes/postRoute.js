const { createPost, getAllPosts, likePost, deleteSelfPost, deleteAnyPost, unlikePost, getUserPosts, getLikedPosts, getFollowedUserPosts, getBookmarkedPosts, getPostsByCategory, getPostsByUserId } = require('../Controllers/postController');
const { checkToken,checkRole } = require('../Middlewares/middleware');
const upload = require('../Middlewares/multerConfig');

const postRoute = require('express').Router();

postRoute.post('/createpost', upload.single('recipeimg'),checkToken,createPost);
postRoute.get('/getallposts',checkToken,getAllPosts)
postRoute.post('/:id/like',checkToken,likePost)
postRoute.post('/:id/unlike',checkToken,unlikePost)
postRoute.delete('/:id/deleteselfpost',checkToken,deleteSelfPost)
postRoute.delete('/:id/deleteanypost',checkToken,checkRole(['admin']),deleteAnyPost)

postRoute.get('/myposts', checkToken, getUserPosts);
postRoute.get('/likedposts', checkToken, getLikedPosts);    
postRoute.get('/followedposts', checkToken, getFollowedUserPosts);
postRoute.get('/bookmarkedposts', checkToken, getBookmarkedPosts);
postRoute.get('/category/:categoryId', checkToken, getPostsByCategory);
postRoute.get('/userposts/:userId', checkToken, getPostsByUserId);

module.exports = postRoute;
