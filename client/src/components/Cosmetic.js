//Cosmetic.js file
import React, { useEffect, useState } from "react";
import { Link,useNavigate  } from "react-router-dom";

const Cosmetic = () => {
  const [cosmetics, setCosmetics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      fetch("http://localhost:5555/api/cosmetics", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setCosmetics(data.data))
        .catch((err) => console.error(err));
  }, []);
  
  const handleNewCosmeticClick = () => {
    navigate("/cosmetic/new");
  };

  return (
    <div className="container">
      <h1>Your Cosmetics</h1>
      <button onClick={handleNewCosmeticClick}>New cosmetic</button>
      {cosmetics.length > 0 ? (
        <div className="grid">
          {cosmetics.map((cosmetic) => (
            <div key={cosmetic.id} className="product-card">
              <h3>{cosmetic.name}</h3>
              <p>Brand: {cosmetic.brand}</p>
              <p>Description: {cosmetic.description}</p>
              <p>Provider: {cosmetic.provider}</p>
              <Link to={`/cosmetics/${cosmetic.id}`}>View Cosmetic</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>You don't have any cosmetics yet. Add a cosmetic to see them here.</p>
      )}
    </div>
  );
};

export default Cosmetic;