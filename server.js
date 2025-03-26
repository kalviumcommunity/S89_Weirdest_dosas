const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
require('dotenv').config();
const router= require('./router');

app.get('/ping', (req, res) => {
  res.send('pong');
});
let isConnectedToDataBase =false;

app.listen(8080,async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('server connected sucessfully')
    isConnectedToDataBase =true;
  }catch(err){
    console.log(err);

  }
}) 

app.use('/',router);
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

