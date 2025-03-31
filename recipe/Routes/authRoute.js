import { signUp, login, followUser, unfollowUser, getFollowing, getFollowers, createBookmarkedPosts, showBookmarkPost, unBookmarkPost, uploadProfilePic, uploadCoverPic, getLoggedInUser, updateBio, getUserById, changePassword } from '../Controllers/userController.js';
import { checkRole, checkToken, deleteToken } from '../Middlewares/middleware.js';
import upload from '../Middlewares/multerConfig.js';
import express from 'express';

const authRoute = express.Router();

authRoute.post('/signup', signUp);
authRoute.post('/login', login);
authRoute.patch('/follow/:userIdToFollow', checkToken, followUser);
authRoute.patch('/unfollow/:userIdToUnfollow', checkToken, unfollowUser);
authRoute.get('/:userId/following', getFollowing);
authRoute.get('/:userId/followers', getFollowers);
authRoute.get('/currentuserdata', checkToken, getLoggedInUser);
authRoute.post('/logout', checkToken, deleteToken);

authRoute.patch('/bookmarkpost', checkToken, createBookmarkedPosts);
authRoute.get('/showbookmark', checkToken, showBookmarkPost);
authRoute.patch('/unbookmarkpost', checkToken, unBookmarkPost);
authRoute.patch('/uploadprofilepic', upload.single('profilePic'), checkToken, uploadProfilePic);
authRoute.patch('/uploadcoverpic', upload.single('coverPic'), checkToken, uploadCoverPic);
authRoute.patch('/updatebio', checkToken, updateBio);
authRoute.get('/user/:userId', checkToken, getUserById);
authRoute.patch('/changepassword', checkToken, changePassword);

export default authRoute;
