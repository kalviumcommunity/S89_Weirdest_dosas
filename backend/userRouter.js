const express = require('express');
const router = express.Router();
const User = require('./userSchema');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({ msg: "User already exists" });
        }
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        return res.status(200).send({ msg: "User created successfully", data: savedUser });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).send({ msg: "Invalid password" });
        }
        return res.status(200).send({ msg: "User logged in successfully", data: user });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});

router.get('/get', async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).send({ msg: "Users", data: users });
    } catch (error) {
        return res.status(500).send({ msg: "Something went wrong" });
    }
});



module.exports = router;
