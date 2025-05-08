import React, { useState, useEffect } from 'react';
import { getDosas } from './api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [dosas, setDosas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    const fetchDosas = async () => {
      setLoading(true);
      const data = await getDosas();
      setDosas(data || []);
      setLoading(false);
    };

    fetchDosas();
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to Weirdest Dosas</h1>
      <p>Discover the most unique and creative dosa recipes from around the world!</p>

      {user ? (
        <div className="user-actions">
          <Link to="/add-entity" className="action-button">Add Your Own Dosa</Link>
        </div>
      ) : (
        <div className="auth-prompt">
          <p>Sign up or log in to add your own dosa creations!</p>
          <div className="auth-buttons">
            <Link to="/signup" className="auth-button">Sign Up</Link>
            <Link to="/login" className="auth-button">Login</Link>
          </div>
        </div>
      )}

      <div className="dosas-container">
        <h2>Latest Dosa Creations</h2>
        {loading ? (
          <p>Loading dosas...</p>
        ) : dosas.length > 0 ? (
          <div className="dosas-grid">
            {dosas.map((dosa) => (
              <div key={dosa._id} className="dosa-card">
                <h3>{dosa.name}</h3>
                <p><strong>Ingredients:</strong> {dosa.mainIngredients.join(', ')}</p>
                <p>{dosa.description}</p>
                {user && (
                  <div className="dosa-actions">
                    <Link to={`/edit-entity/${dosa._id}`} className="edit-button">Edit</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No dosas found. Be the first to add one!</p>
        )}
      </div>

      <style>{`
        .home-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .auth-prompt {
          margin: 30px 0;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          text-align: center;
        }

        .auth-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
        }

        .auth-button, .action-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #0077cc;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .auth-button:hover, .action-button:hover {
          background-color: #005fa3;
        }

        .user-actions {
          margin: 30px 0;
          text-align: center;
        }

        .dosas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .dosa-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dosa-actions {
          margin-top: 15px;
          display: flex;
          justify-content: flex-end;
        }

        .edit-button {
          padding: 5px 10px;
          background-color: #f0f0f0;
          color: #333;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background-color 0.3s;
        }

        .edit-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default Home;
