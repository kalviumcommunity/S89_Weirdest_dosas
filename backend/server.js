// Load environment variables first
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// For debugging
console.log('__dirname:', __dirname);
console.log('Env file path:', path.resolve(__dirname, '.env'));

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
const router = require('./router');
const userRouter = require('./userRouter');
const cors = require('cors');

// Configure CORS to allow credentials and specific origin
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true
}));

// Add cookie parser middleware
app.use(cookieParser());

app.get('/ping', (req, res) => {
  res.send('pong');
});
let isConnectedToDataBase =false;

app.listen(8080, async () => {
  try {
    // Debug MongoDB URI
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      console.error('MongoDB URI is undefined. Check your .env file.');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Server connected successfully to MongoDB');
    isConnectedToDataBase = true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})

app.use('', router);
app.use('/users', userRouter);
app.get('/',(req,res)=>{
  try{
    if(isConnectedToDataBase){
    res.status(201).send("connected to mongodb");
  }
  else{
    res.status(500).send("not connected to mongodb");
  }

  }catch(err){
    res.status(500).send({msg:"something went wrong",err})
  }
})

