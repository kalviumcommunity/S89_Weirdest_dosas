const mongoose = require('mongoose');

const dosaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mainIngredients: {
        type: [String], // Array of strings to store multiple ingredients
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Dosa = mongoose.model('Dosa', dosaSchema);

module.exports = Dosa;