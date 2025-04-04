const express = require('express');

const router = express.Router();
const model = require('./Schema');

router.post('/post',async(req,res)=>{
    try {
        const dosa = req.body;
        if(!dosa.name||!dosa.mainIngredients||!dosa.description){
            return res.status(400).send({msg:"Enter all name,mainIngredients,description"});
        }
        const newDosa= new model(dosa);
        const savedDosa = await newDosa.save();
        return res.status(200).send({msg:"Dosa created sucessfully",data:savedDosa});
    } catch (error) {
        return res.status(500).send({msg:"something went wrong"});
    }
})

router.get('/get',async(req,res)=>{
    try {
        const dosas = await model.find();
        return res.status(200).send({msg:"Dosas",data:dosas});
    } catch (error) {
        return res.status(500).send({msg:"something went wrong"});
    }
})

router.put('/put/:id', async (req, res) => {
    try {
        const updatedDosa = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDosa) {
            return res.status(404).send({ msg: "Dosa not found" });
        }
        return res.status(200).send({ msg: "Dosa updated successfully", data: updatedDosa });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedDosa = await model.findByIdAndDelete(req.params.id);
        if (!deletedDosa) {
            return res.status(404).send({ msg: "Dosa not found" });
        }
        return res.status(200).send({ msg: "Dosa deleted successfully", data: deletedDosa });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});




module.exports = router;