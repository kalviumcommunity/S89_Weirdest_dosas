const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mainIngredients:{
        type:[String],
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const model = mongoose.model("Dosas",schema);
 
module.exports= model;