import React, { useState, useEffect } from "react";
import { getDosas, createDosa, deleteDosa, getUsers } from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddEntityPage = () => {
  const navigate = useNavigate();
  const [dosas, setDosas] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [form, setForm] = useState({ name: "", mainIngredients: "", description: "", userId: "", created_by: "" });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchDosas = async (userId = null, created_by = null) => {
    setLoading(true);
    const data = await getDosas(userId, created_by);
    setDosas(data || []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data || []);
    // If users are available, set the first user as default for the form
    if (data && data.length > 0) {
      setForm(prev => ({ ...prev, userId: data[0]._id }));
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      // Redirect to login if not authenticated
      alert("Please log in to add or edit dosas");
      navigate('/login');
      return;
    }

    setCurrentUser(JSON.parse(loggedInUser));
    fetchDosas();
    fetchUsers();
  }, [navigate]);

  // Handle user filter change
  const handleUserFilterChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    fetchDosas(userId || null); // Pass null if empty string to get all dosas
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      alert("Please log in to add dosas");
      navigate('/login');
      return;
    }

    if (!form.name.trim() || !form.mainIngredients.trim() || !form.description.trim()) return;

    const payload = {
      name: form.name,
      mainIngredients: form.mainIngredients.split(',').map(i => i.trim()).filter(Boolean),
      description: form.description,
      userId: loggedInUser._id // Use the logged-in user's ID
    };

    try {
      await createDosa(payload);
      setForm({ ...form, name: "", mainIngredients: "", description: "" });
      alert("Dosa created successfully!");
      fetchDosas(selectedUser || null);
    } catch (error) {
      console.error("Error creating dosa:", error);
      alert("Failed to create dosa. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteDosa(id);
    fetchDosas(selectedUser || null);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Add New Dosa</h2>

      {currentUser && (
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            Creating as: <strong>{currentUser.username}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Main Ingredients (comma separated):</label>
          <input
            type="text"
            name="mainIngredients"
            value={form.mainIngredients}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
      </form>

      {/* Filter dosas by user */}
      <div style={{ marginBottom: 20 }}>
        <h3>Filter Dosas by User</h3>
        <select
          value={selectedUser}
          onChange={handleUserFilterChange}
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
      </div>

      <h3>All Dosas {selectedUser && "(Filtered by user)"}</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {dosas && dosas.length > 0 ? dosas.map((dosa) => (
            <li key={dosa._id || dosa.id} style={{ marginBottom: 8 }}>
              <strong>{dosa.name}</strong>: {dosa.description}
              <button style={{ marginLeft: 12 }} onClick={() => handleDelete(dosa._id || dosa.id)}>Delete</button>
              <button style={{ marginLeft: 8 }} onClick={() => window.location.href = `/edit-entity/${dosa._id || dosa.id}`}>Edit</button>
            </li>
          )) : <li>No dosas found.</li>}
        </ul>
      )}
    </div>
  );
};

export default AddEntityPage;