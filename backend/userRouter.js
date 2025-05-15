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
        res.cookie('username', user.username, {
            maxAge: 86400000*7,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'lax'
        });
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

        // Set a cookie with the username
        // Cookie will expire in 24 hours (86400000 milliseconds)
        res.cookie('username', user.username, {
            maxAge: 86400000*7,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'lax'
        });

        return res.status(200).send({ msg: "User logged in successfully", data: user });
    } catch (error) {
        console.error("Login error:", error);
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

// Logout endpoint to clear the cookie
router.post('/logout', (req, res) => {
    try {
        // Clear the username cookie
        res.clearCookie('username', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return res.status(200).send({ msg: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).send({ msg: "Something went wrong during logout" });
    }
});

// Get current user from cookie
router.get('/current', (req, res) => {
    try {
        const username = req.cookies.username;

        if (!username) {
            return res.status(401).send({ msg: "Not authenticated" });
        }

        // Find the user by username
        User.findOne({ username })
            .then(user => {
                if (!user) {
                    // Clear invalid cookie
                    res.clearCookie('username');
                    return res.status(404).send({ msg: "User not found" });
                }

                // Return user data without password
                const userData = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };

                return res.status(200).send({ msg: "User authenticated", data: userData });
            })
            .catch(err => {
                console.error("Error finding user:", err);
                return res.status(500).send({ msg: "Something went wrong" });
            });
    } catch (error) {
        console.error("Auth check error:", error);
        return res.status(500).send({ msg: "Something went wrong" });
    }
});


module.exports = router;
