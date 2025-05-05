import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDosas, updateDosa } from "../api";

const EditEntityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mainIngredients: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDosa = async () => {
      setLoading(true);
      const dosas = await getDosas();
      const dosa = dosas.find(d => (d._id || d.id) === id);
      if (dosa) {
        setForm({
          name: dosa.name || "",
          mainIngredients: (dosa.mainIngredients || []).join(", "),
          description: dosa.description || ""
        });
      }
      setLoading(false);
    };
    fetchDosa();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mainIngredients.trim() || !form.description.trim()) return;
    setLoading(true);
    const payload = {
      name: form.name,
      mainIngredients: form.mainIngredients.split(',').map(i => i.trim()).filter(Boolean),
      description: form.description
    };
    await updateDosa(id, payload);
    setLoading(false);
    navigate("/add-entity");
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Edit Dosa</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <button type="submit" style={{ padding: "8px 16px" }}>Update</button>
        </form>
      )}
    </div>
  );
};

export default EditEntityPage;