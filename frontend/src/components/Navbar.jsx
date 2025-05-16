import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { logout, getCurrentUser } from '../api';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get user from cookie
        const userData = await getCurrentUser();

        if (userData) {
          setUser(userData);
          // Update localStorage for backward compatibility
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // Fallback to localStorage if cookie auth fails
          const loggedInUser = localStorage.getItem('user');
          if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear potentially invalid data
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await logout();

      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Clear auth token from axios headers
      setAuthToken(null);

      // Update state
      setUser(null);

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to='/'>Weirdest dosas</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/add-entity">Add Dosa</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
            <li className="user-greeting">
              Hello, {user.username}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;