const express = require('express');
const router = express.Router();
const User = require('./userSchema');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-jwt';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).json({ msg: "Token is not valid" });
    }
};

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({ msg: "User already exists" });
        }

        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();

        // Create JWT payload
        const payload = {
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        };

        
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
                if (err) throw err;

                // Set the token in a cookie
                res.cookie('token', token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                    httpOnly: true, // Cannot be accessed by client-side JavaScript
                    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
                    sameSite: 'lax' // Provides some CSRF protection
                });

                // Return user data without password
                const userData = {
                    _id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    createdAt: savedUser.createdAt,
                    updatedAt: savedUser.updatedAt
                };

                return res.status(200).send({
                    msg: "User created successfully",
                    data: userData,
                    token: token // Include token in response for client-side storage if needed
                });
            }
        );
    } catch (error) {
        console.error("Registration error:", error);
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

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        };

        // Sign the JWT token
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
                if (err) throw err;

                // Set the token in a cookie
                res.cookie('token', token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                    httpOnly: true, // Cannot be accessed by client-side JavaScript
                    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
                    sameSite: 'lax' // Provides some CSRF protection
                });

                // Return user data without password
                const userData = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };

                return res.status(200).send({
                    msg: "User logged in successfully",
                    data: userData,
                    token: token // Include token in response for client-side storage if needed
                });
            }
        );
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

// Logout endpoint to clear the JWT token cookie
router.post('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
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

// Get current user from JWT token
router.get('/current', verifyToken, (req, res) => {
    try {
        // User data is already available in req.user from the verifyToken middleware
        const userId = req.user.user.id;

        // Find the user by ID to get the most up-to-date data
        User.findById(userId)
            .then(user => {
                if (!user) {
                    // Clear invalid token
                    res.clearCookie('token');
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

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).send({ msg: "This is a protected route", user: req.user.user });
});


module.exports = router;
