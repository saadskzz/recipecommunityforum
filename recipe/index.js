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

const app = express();
app.use(cors());
app.use(express.json());
const __dirname = path.resolve();
app.use("/upload", cors("*"), express.static(path.join(__dirname, "upload")));

const port = process.env.PORT;
mongoose.connect(process.env.URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', () => {
    console.log('connected');
});

app.use('/auth', authRoute);
app.use('/api', postRoute);
app.use('/engagement', commentRouter);
app.use('/api/v1', discussRoute);
app.use('/askai', recipeRouter);
app.listen(port, () => {
    console.log(`connected to server at port ${port}`);
});