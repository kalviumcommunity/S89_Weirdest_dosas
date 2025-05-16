
import React, { useState } from 'react';
import { signUp, setAuthToken } from './api';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(""); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            setError("All fields are required");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const response = await signUp(form);

            if (response.data.msg === "User created successfully") {
                // If auto-login is enabled (token is returned with registration)
                if (response.data.token) {
                    // Set token in axios headers for future requests
                    setAuthToken(response.data.token);

                    // Store user data
                    localStorage.setItem("user", JSON.stringify(response.data.data));

                    // Redirect to home page (auto-login)
                    window.location.href = "/";
                } else {
                    // Otherwise redirect to login page
                    alert("Account created successfully! Please log in.");
                    window.location.href = "/login";
                }
            }
        } catch (error) {
            console.error("Error signing up:", error);
            if (error.response && error.response.data.msg === "User already exists") {
                setError("Email already in use. Please use a different email or login.");
            } else {
                setError("Sign up failed. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Sign Up</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>

            <style>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                }

                .auth-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                    width: 100%;
                    max-width: 400px;
                }

                .auth-card h1 {
                    margin-top: 0;
                    margin-bottom: 24px;
                    text-align: center;
                    color: #333;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #555;
                }

                .form-group input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }

                .auth-button {
                    width: 100%;
                    padding: 12px;
                    background-color: #0077cc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .auth-button:hover {
                    background-color: #005fa3;
                }

                .auth-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .error-message {
                    background-color: #ffebee;
                    color: #c62828;
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .auth-footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #666;
                }

                .auth-footer a {
                    color: #0077cc;
                    text-decoration: none;
                }

                .auth-footer a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

export default SignUp;