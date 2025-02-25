import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ user }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:5555/api/my_categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to see your categories.</div>;
  }

  return (
    <div className="container">
      <h1>Your Categories</h1>
      {categories.length > 0 ? (
        <div className="grid">
          {categories.map((category) => (
            <div key={category.id} className="product-card">
              <h3>{category.name}</h3>
              <Link to={`/categories/${category.id}`}>View Category</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>You don't have any cosmetics yet. Add a cosmetic to see your categories.</p>
      )}
    </div>
  );
};

export default Home;


