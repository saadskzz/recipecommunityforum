const { createDiscussion, getAllDiscussions, getDiscussionById, deleteDiscussionById } = require('../Controllers/discussionController');
const { checkToken } = require('../Middlewares/middleware');

const discussRoute = require('express').Router();

discussRoute.post('/creatediscussioncategory',createDiscussion)
discussRoute.get('/getdiscussioncategories',checkToken,getAllDiscussions)
discussRoute.get('/getdiscussion/:id',checkToken    ,getDiscussionById)
discussRoute.delete('/deletediscussion:id',deleteDiscussionById)
module.exports = discussRoute