import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import CosmeticForm from "./CosmeticForm";

function CosmeticCard({ cosmetic }) {
  const { deleteCosmetic } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Delete this cosmetic?")) {
      deleteCosmetic(cosmetic.id);
    }
  };

  const toggleEdit = () => setEditing((prev) => !prev);

  return (
    <div style={cardStyle}>
      {editing ? (
        <CosmeticForm
          cosmetic={cosmetic}
          editing={true}
          setShowForm={setEditing}
        />
      ) : (
        <>
          <h3>{cosmetic.title}</h3>
          <p><strong>Category:</strong> {cosmetic.category}</p>
          <p><strong>Description:</strong> {cosmetic.description}</p>
          <p><strong>Note:</strong> {cosmetic.note}</p>

          <button onClick={toggleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", background: "tomato" }}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
  background: "#f9f9f9",
};

export default CosmeticCard;
