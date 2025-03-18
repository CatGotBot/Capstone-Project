import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SingleResort({ token }) {
    const [resort, setResort] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        location: "",
        hours: ""
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getResort() {
            try {
                const response = await fetch(`/api/resorts/${id}`);
                if (!response.ok) {
                    throw new Error(`Response status ${response.status}`);
                }
                const result = await response.json();
                setResort(result);
                setEditForm({
                    name: result.name,
                    location: result.location,
                    hours: result.hours
                });
            } catch (error) {
                console.error("Error fetching resort:", error.message);
            }
        }
        getResort();
    }, [id]);

    const handleEdit = () => {
        if (!token) {
            navigate("/login");
            return;
        }
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`/api/resorts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error("Failed to update resort!");
            }

            const updatedResort = await response.json();
            setResort(updatedResort);
            setIsEditing(false);
            alert("Resort successfully updated!");
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating resort. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this resort?")) {
            return;
        }

        try {
            const response = await fetch(`/api/resorts/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete resort!");
            }

            alert("Resort successfully deleted!");
            navigate("/resorts");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting resort. Please try again.");
        }
    };

    if (!resort.id) {
        return <p>Loading resort details...</p>;
    }

    return (
        <div className="single-resort">
            {!isEditing ? (
                <>
                    <h2>{resort.name}</h2>
                    <p><strong>Location:</strong> {resort.location}</p>
                    <p><strong>Hours:</strong> {resort.hours}</p>

                    {token && (
                        <div className="resort-actions">
                            <button onClick={handleEdit}>Edit Resort</button>
                            <button onClick={handleDelete} className="delete-btn">Delete Resort</button>
                        </div>
                    )}
                </>
            ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                    <h2>Edit Resort</h2>
                    <div className="form-group">
                        <label htmlFor="name">Resort Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={editForm.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hours">Hours:</label>
                        <input
                            type="text"
                            id="hours"
                            name="hours"
                            value={editForm.hours}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}

            <button onClick={() => navigate("/resorts")} className="back-btn">Back to All Resorts</button>
        </div>
    );
}