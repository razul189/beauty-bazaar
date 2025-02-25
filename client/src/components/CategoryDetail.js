import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const CategoryDetail = () => {
  const { id } = useParams();
  const [cosmetics, setCosmetics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5555/api/cosmetics`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cosmetics");
        return res.json();
      })
      .then((data) => {
        // Filter cosmetics by the given category id
        const filtered = data.filter(
          (cosmetic) => cosmetic.category_id === parseInt(id)
        );
        setCosmetics(filtered);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!cosmetics) return <div>Loading...</div>;
  if (cosmetics.length === 0)
    return <div>No products in this category.</div>;

  // Assuming all cosmetics in the category share the same category name
  const categoryName =
    cosmetics[0].category && cosmetics[0].category.name
      ? cosmetics[0].category.name
      : "Unknown";

  return (
    <div className="container">
      <h1>{categoryName}</h1>
      <div className="grid">
        {cosmetics.map((cosmetic) => (
          <div key={cosmetic.id} className="product-card">
            <h3>{cosmetic.name}</h3>
            <p>Brand: {cosmetic.brand}</p>
            <p>Price: ${cosmetic.price}</p>
            <Link to={`/cosmetics/${cosmetic.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetail;

