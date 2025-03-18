import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Resorts() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getResorts() {
      try {
        const response = await fetch('/api/resorts');
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        setResorts(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resorts:", error.message);
        setLoading(false);
      }
    }
    getResorts();
  }, []);

  const filteredResorts = resorts.filter(resort =>
    resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resorts-container">
      <h1>Ski Resorts</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading resorts...</p>
      ) : (
        <ul className="resorts-list">
          {filteredResorts.length > 0 ? (
            filteredResorts.map((resort) => (
              <li 
                key={resort.id} 
                onClick={() => navigate(`/resorts/${resort.id}`)}
                className="resort-item"
              >
                <h3>{resort.name}</h3>
                <p>Location: {resort.location}</p>
                <p>Hours: {resort.hours}</p>
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