
import React, { useState } from 'react';
import { login } from './api';
import { Link } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(""); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.email.trim() || !form.password.trim()) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const response = await login(form);

            if (response.data.msg === "User logged in successfully") {
                localStorage.setItem("user", JSON.stringify(response.data.data));
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Error logging in:", error);
            if (error.response) {
                if (error.response.status === 404) {
                    setError("User not found. Please check your email.");
                } else if (error.response.status === 401) {
                    setError("Invalid password. Please try again.");
                } else {
                    setError("Login failed. Please try again later.");
                }
            } else {
                setError("Login failed. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Login</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
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

export default Login
