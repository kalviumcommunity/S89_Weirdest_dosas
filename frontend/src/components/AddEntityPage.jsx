import React, { useState, useEffect } from "react";
import { getDosas, createDosa } from "../api";

const AddEntityPage = () => {
  const [dosas, setDosas] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
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
    if (!form.name.trim()) return;
    await createDosa(form);
    setForm({ name: "", description: "" });
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
            </li>
          )) : <li>No dosas found.</li>}
        </ul>
      )}
    </div>
  );
};

export default AddEntityPage;