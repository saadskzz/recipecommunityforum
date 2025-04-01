import 'dotenv/config';
import authRoute from './Routes/authRoute.js';
import expressValidator from 'express-validator';
import cors from 'cors';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import postRoute from './Routes/postRoute.js';
import commentRouter from './Routes/commentRoute.js';
import discussRoute from './Routes/discussionRoute.js';
import recipeRouter from './Routes/recipeRoute.js';
import { initializeDiscussionCategories } from './Controllers/discussionController.js';

const app = express();
app.use(cors());
app.use(express.json());
const __dirname = path.resolve();
app.use("/upload", cors("*"), express.static(path.join(__dirname, "upload")));

const port = process.env.PORT;
mongoose.connect(process.env.URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', async () => {
    console.log('connected to database');
    console.log('Initializing discussion categories...');
    try {
        await initializeDiscussionCategories({}, null); // Pass `null` for `res` during server startup
        console.log('Discussion categories initialized successfully.');
    } catch (error) {
        console.error('Error initializing discussion categories:', error.message);
    }
});

app.use('/auth', authRoute);
app.use('/api', postRoute);
app.use('/engagement', commentRouter);
app.use('/api/v1', discussRoute);
app.use('/askai', recipeRouter);
app.get('/initialize-discussions', async (req, res) => {
    console.log('Endpoint /initialize-discussions called');
    await initializeDiscussionCategories(req, res);
});
app.listen(port, () => {
    console.log(`connected to server at port ${port}`);
});