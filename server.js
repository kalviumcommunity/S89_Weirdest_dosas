const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(8080,async()=>{
  try{
    await mongoose.connect('mongodb+srv://akhil031215n:HKU3fQQmC6LvK9Wi@cluster0.wtzd8.mongodb.net/');
    console.log('server connected sucessfully')
  }catch(err){
    console.log(err);

  }
})

