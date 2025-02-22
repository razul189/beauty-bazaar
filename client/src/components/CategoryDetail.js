import React from "react";
import { useParams, Link } from "react-router-dom";

const CategoryDetail = ({ cosmetics }) => {
  const { id } = useParams();
  const filteredCosmetics = cosmetics.filter(
    (cosmetic) => cosmetic.category_id === parseInt(id)
  );

  if (filteredCosmetics.length === 0)
    return <div>No products in this category.</div>;

  // All cosmetics in the category share the same category name.
  const categoryName = filteredCosmetics[0].category
    ? filteredCosmetics[0].category.name
    : "Unknown";

  return (
    <div className="container">
      <h1>{categoryName}</h1>
      <div className="grid">
        {filteredCosmetics.map((cosmetic) => (
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
