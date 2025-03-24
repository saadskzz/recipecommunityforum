const { signUp, login, followUser, unfollowUser, getFollowing, getFollowers, createBookmarkedPosts, showBookmarkPost, unBookmarkPost, uploadProfilePic, uploadCoverPic, getLoggedInUser, updateBio,getUserById } = require('../Controllers/userController');
const { checkRole, checkToken, deleteToken } = require('../Middlewares/middleware');
const upload = require('../Middlewares/multerConfig');

const authRoute = require('express').Router();
authRoute.post('/signup',signUp);
authRoute.post('/login',login);
authRoute.patch('/follow/:userIdToFollow', checkToken, followUser) // Updated route
authRoute.patch('/unfollow/:userIdToUnfollow', checkToken, unfollowUser) // Updated route
authRoute.get('/:userId/following',getFollowing)
authRoute.get('/:userId/followers',getFollowers)
authRoute.get('/currentuserdata',checkToken,getLoggedInUser)
authRoute.post('/logout',checkToken,deleteToken)

authRoute.patch('/bookmarkpost',checkToken,createBookmarkedPosts)
authRoute.get('/showbookmark',checkToken,showBookmarkPost)
authRoute.patch('/unbookmarkpost',checkToken,unBookmarkPost)
authRoute.patch('/uploadprofilepic', upload.single('profilePic'), checkToken, uploadProfilePic);
authRoute.patch('/uploadcoverpic',  upload.single('coverPic'),checkToken, uploadCoverPic);
authRoute.patch('/updatebio', checkToken, updateBio);
authRoute.get('/user/:userId', checkToken, getUserById);
module.exports = authRoute
