import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Resorts({ token }) {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getResorts() {
      try {
        const response = await fetch('/api/resorts');
        const result = await response.json();
        setResorts(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resorts:", error);
        setLoading(false);
      }
    }
    getResorts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resort?")) return;

    try {
      const response = await fetch(`/api/resorts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete resort');

      setResorts(resorts.filter(r => r.id !== id));
      alert("Resort deleted!");
    } catch (error) {
      console.error("Error deleting resort:", error);
      alert("Unable to delete resort.");
    }
  };

  const filteredResorts = resorts.filter(resort =>
    resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resorts-container">
      <h1>Ski Resorts</h1>

      {token && <button onClick={() => navigate('/resorts/new')}>Add New Resort</button>}

      <input
        type="text"
        placeholder="Search by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading resorts...</p>
      ) : (
        <ul className="resorts-list">
          {filteredResorts.length ? (
            filteredResorts.map(resort => (
              <li key={resort.id}>
                <h3>{resort.name}</h3>
                <p>{resort.location} | {resort.hours}</p>

                {token && (
                  <div className="actions">
                    <button onClick={() => navigate(`/resorts/${resort.id}`)}>View/Edit</button>
                    <button onClick={() => handleDelete(resort.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No resorts found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
