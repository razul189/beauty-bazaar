import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const CosmeticDetail = () => {
  const { id } = useParams();
  const [cosmetic, setCosmetic] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/api/cosmetics")
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((c) => c.id === parseInt(id));
        setCosmetic(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!cosmetic) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{cosmetic.name}</h1>
      <p>Brand: {cosmetic.brand}</p>
      <p>{cosmetic.description}</p>
      <p>Price: ${cosmetic.price}</p>
      {/* might add edit or delete buttons */}
    </div>
  );
};

export default CosmeticDetail;
