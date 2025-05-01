import React, { useState, useEffect } from "react";
import { getDosas, createDosa, deleteDosa } from "../api";

const AddEntityPage = () => {
  const [dosas, setDosas] = useState([]);
  const [form, setForm] = useState({ name: "", mainIngredients: "", description: "" });
  const [loading, setLoading] = useState(false);

  const fetchDosas = async () => {
    setLoading(true);
    const data = await getDosas();
    setDosas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDosas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mainIngredients.trim() || !form.description.trim()) return;
    const payload = {
      name: form.name,
      mainIngredients: form.mainIngredients.split(',').map(i => i.trim()).filter(Boolean),
      description: form.description
    };
    await createDosa(payload);
    setForm({ name: "", mainIngredients: "", description: "" });
    fetchDosas();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteDosa(id);
    fetchDosas();
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Add New Dosa</h2>
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
      <h3>All Dosas</h3>
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