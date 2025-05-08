const mongoose = require('mongoose');

const dosaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Dosa = mongoose.model('Dosa', dosaSchema);

module.exports = Dosa;