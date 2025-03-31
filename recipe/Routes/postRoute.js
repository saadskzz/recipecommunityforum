import { createPost, getAllPosts, likePost, deleteSelfPost, deleteAnyPost, unlikePost, getUserPosts, getLikedPosts, getFollowedUserPosts, getBookmarkedPosts, getPostsByCategory, getPostsByUserId } from '../Controllers/postController.js';
import { checkToken, checkRole } from '../Middlewares/middleware.js';
import upload from '../Middlewares/multerConfig.js';
import express from 'express';

const postRoute = express.Router();

postRoute.post('/createpost', upload.single('recipeimg'), checkToken, createPost);
postRoute.get('/getallposts', checkToken, getAllPosts);
postRoute.post('/:id/like', checkToken, likePost);
postRoute.post('/:id/unlike', checkToken, unlikePost);
postRoute.delete('/:id/deleteselfpost', checkToken, deleteSelfPost);
postRoute.delete('/:id/deleteanypost', checkToken, checkRole(['admin']), deleteAnyPost);

postRoute.get('/myposts', checkToken, getUserPosts);
postRoute.get('/likedposts', checkToken, getLikedPosts);
postRoute.get('/followedposts', checkToken, getFollowedUserPosts);
postRoute.get('/bookmarkedposts', checkToken, getBookmarkedPosts);
postRoute.get('/category/:categoryId', checkToken, getPostsByCategory);
postRoute.get('/userposts/:userId', checkToken, getPostsByUserId);

export default postRoute;
