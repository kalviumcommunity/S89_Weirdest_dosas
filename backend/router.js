const express = require('express');
const router = express.Router();
const Dosa = require('./Schema');

router.post('/post', async (req, res) => {
    try {
        const dosa = req.body;
        if (!dosa.mainIngredients || !dosa.name || !dosa.description) {
            return res.status(400).send({ msg: "Enter all name, mainIngredients, description" });
        }
        const newDosa = new Dosa(dosa); // Corrected model reference
        const savedDosa = await newDosa.save();
        return res.status(200).send({ msg: "Dosa created successfully", data: savedDosa });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});

router.get('/get', async (req, res) => {
    try {
        const dosas = await Dosa.find(); // Corrected model reference
        return res.status(200).send({ msg: "Dosas", data: dosas });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});

router.put('/put/:id', async (req, res) => {
    try {
        const updatedDosa = await Dosa.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Corrected model reference
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
        const deletedDosa = await Dosa.findByIdAndDelete(req.params.id); // Corrected model reference
        if (!deletedDosa) {
            return res.status(404).send({ msg: "Dosa not found" });
        }
        return res.status(200).send({ msg: "Dosa deleted successfully", data: deletedDosa });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});

module.exports = router;