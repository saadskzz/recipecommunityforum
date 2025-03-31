import { createDiscussion, getAllDiscussions, getDiscussionById, deleteDiscussionById } from '../Controllers/discussionController.js';
import { checkToken } from '../Middlewares/middleware.js';
import express from 'express';

const discussRoute = express.Router();

discussRoute.post('/creatediscussioncategory', createDiscussion);
discussRoute.get('/getdiscussioncategories', checkToken, getAllDiscussions);
discussRoute.get('/getdiscussion/:id', checkToken, getDiscussionById);
discussRoute.delete('/deletediscussion:id', deleteDiscussionById);

export default discussRoute;