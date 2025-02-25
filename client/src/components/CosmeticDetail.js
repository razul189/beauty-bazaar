import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CosmeticDetail = ({ user }) => {
  const { id } = useParams();
  const [cosmetic, setCosmetic] = useState(null);

  useEffect(() => {
    fetch(fetch(`http://localhost:5555/api/cosmetics/${id}`)
) 
      .then((res) => res.json())
      .then((data) => setCosmetic(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!cosmetic) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{cosmetic.name}</h1>
      <p>Brand: {cosmetic.brand}</p>
      <p>{cosmetic.description}</p>
      <p>Price: ${cosmetic.price}</p>
      {/* Add more details or edit/delete options as needed */}
    </div>
  );
};

export default CosmeticDetail;

