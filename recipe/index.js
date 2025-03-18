require('dotenv').config();
const authRoute = require('./Routes/authRoute')
const expressValidator = require('express-validator')
const cors = require('cors')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose');
const postRoute = require('./Routes/postRoute');
const commentRouter = require('./Routes/commentRoute');
const discussRoute = require('./Routes/discussionRoute');
const app = express();
app.use(cors());
app.use(express.json());
app.use("/upload", cors("*"), express.static(path.join(__dirname, "upload")));

const port = process.env.PORT
mongoose.connect(process.env.URL) 
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', () => {
    console.log('connected')
})

app.use('/auth',authRoute)
app.use('/api',postRoute)
app.use('/engagement',commentRouter)
app.use('/api/v1',discussRoute)
app.listen(port,()=>{
    console.log(`connected to server at port ${port}`)
})