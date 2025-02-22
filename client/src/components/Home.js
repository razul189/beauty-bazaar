import React from "react";
import { Link } from "react-router-dom";

const Home = ({ cosmetics }) => {
  // Group cosmetics by category_id.
  const categoriesMap = cosmetics.reduce((acc, cosmetic) => {
    const catId = cosmetic.category_id;
    // Ensure the cosmetic includes a serialized category; adjust as needed.
    if (!acc[catId]) {
      acc[catId] = {
        id: catId,
        name: cosmetic.category ? cosmetic.category.name : "Unknown",
        cosmetics: [],
      };
    }
    acc[catId].cosmetics.push(cosmetic);
    return acc;
  }, {});

  const categories = Object.values(categoriesMap);

  return (
    <div className="container">
      <h1>Your Categories</h1>
      <div className="grid">
        {categories.map((category) => (
          <div key={category.id} className="product-card">
            <h3>{category.name}</h3>
            <p>{category.cosmetics.length} product(s)</p>
            <Link to={`/categories/${category.id}`}>View Category</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
