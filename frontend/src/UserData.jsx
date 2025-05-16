import React, { useState, useEffect } from "react";
import { getUsers, getDosas } from "./api";
import { Link } from "react-router-dom";

const UserData = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [userDosaCounts, setUserDosaCounts] = useState({});
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch users
                const userData = await getUsers();
                setUsers(userData || []);

                // Fetch dosas to count per user
                const dosas = await getDosas();
                if (dosas && dosas.length > 0) {
                    const counts = {};
                    dosas.forEach(dosa => {
                        if (dosa.userId) {
                            counts[dosa.userId] = (counts[dosa.userId] || 0) + 1;
                        }
                    });
                    setUserDosaCounts(counts);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    // Handle user selection change
    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);

        if (userId) {
            const user = users.find(u => u._id === userId);
            setSelectedUser(user);
        } else {
            setSelectedUser(null);
        }
    };

    return (
        <div className="users-container">
            <h1>Community Members</h1>
            <p className="subtitle">Meet the creative minds behind our unique dosa creations</p>

            {users.length === 0 ? (
                <div className="no-users">
                    <p>No users found. Be the first to sign up!</p>
                    <Link to="/signup" className="signup-link">Sign Up Now</Link>
                </div>
            ) : (
                <div className="user-dropdown-container">
                    <div className="dropdown-wrapper">
                        <label htmlFor="user-select">Select a user:</label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={handleUserChange}
                            className="user-dropdown"
                        >
                            <option value="">-- Select a user --</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.username} {currentUser && currentUser._id === user._id ? '(You)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedUser ? (
                        <div className="user-detail-card">
                            <div className="user-avatar large">
                                {selectedUser.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-detail-info">
                                <h2>{selectedUser.username}</h2>
                                <p className="user-email">{selectedUser.email}</p>
                                <p className="user-stats">
                                    <span className="stat-label">Dosas Created:</span>
                                    <span className="stat-value">{userDosaCounts[selectedUser._id] || 0}</span>
                                </p>
                                <p className="user-joined">
                                    Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                                </p>
                                {currentUser && currentUser._id === selectedUser._id && (
                                    <div className="current-user-badge">This is you</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="select-prompt">
                            <p>Please select a user from the dropdown to view their details</p>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .users-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 10px;
                }

                .subtitle {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }

                .user-dropdown-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                }

                .dropdown-wrapper {
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                }

                .dropdown-wrapper label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: 500;
                    color: #555;
                }

                .user-dropdown {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    background-color: white;
                    cursor: pointer;
                    color:black;
                    transition: border-color 0.3s;
                }

                .user-dropdown:focus {
                    outline: none;
                    border-color: #0077cc;
                    box-shadow: 0 0 0 2px rgba(0, 119, 204, 0.2);
                }

                .user-detail-card {
                    display: flex;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                    width: 100%;
                    max-width: 600px;
                    position: relative;
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .user-detail-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .user-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: #0077cc;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-right: 20px;
                }

                .user-avatar.large {
                    width: 80px;
                    height: 80px;
                    font-size: 32px;
                }

                .user-detail-info {
                    flex: 1;
                }

                .user-detail-info h2 {
                    margin: 0 0 10px 0;
                    font-size: 1.5rem;
                    color: #333;
                }

                .user-email {
                    color: #666;
                    margin: 0 0 15px 0;
                    font-size: 1rem;
                }

                .user-stats {
                    margin: 10px 0;
                    font-size: 1rem;
                    background-color: #f5f9ff;
                    padding: 10px 15px;
                    border-radius: 6px;
                    display: inline-block;
                }

                .stat-label {
                    font-weight: 500;
                    margin-right: 5px;
                }

                .stat-value {
                    font-weight: bold;
                    color: #0077cc;
                }

                .user-joined {
                    font-size: 0.9rem;
                    color: #888;
                    margin-top: 15px;
                }

                .current-user-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background-color: #0077cc;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .select-prompt {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border-radius: 8px;
                    text-align: center;
                    color: #666;
                    width: 100%;
                    max-width: 600px;
                }

                .no-users {
                    text-align: center;
                    padding: 40px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 600px;
                }

                .signup-link {
                    display: inline-block;
                    margin-top: 15px;
                    padding: 10px 20px;
                    background-color: #0077cc;
                    color: white;
                    border-radius: 4px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }

                .signup-link:hover {
                    background-color: #005fa3;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                }

                .loading-spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top: 4px solid #0077cc;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default UserData
