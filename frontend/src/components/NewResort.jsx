import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewResort({ token }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateResort = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/resorts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, location, hours })
      });

      if (!response.ok) {
        throw new Error("Failed to create resort");
      }

      alert("Resort successfully added!");
      navigate("/resorts");
    } catch (error) {
      console.error("Error adding resort:", error);
      setError("Could not create resort. Try again.");
    }
  };

  return (
    <div className="new-resort-container">
      <h2>Add New Ski Resort</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleCreateResort} className="resort-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Hours:</label>
          <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} required />
        </div>
        <button type="submit">Create Resort</button>
      </form>
      <button onClick={() => navigate("/resorts")}>Back to Resorts</button>
    </div>
  );
}
