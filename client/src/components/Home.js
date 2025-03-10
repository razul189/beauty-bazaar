import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch("http://localhost:5555/api/my_categories",{
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setCategories(data.data))
        .catch((err) => alert("Failed to create category"));
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to see your categories.</div>;
  }
  const handleNewCategoryClick = () => {
    navigate("/category/new");
  };

  return (
    <div className="container">
      <h1>Your Categories</h1>
      <button onClick={handleNewCategoryClick}>New category</button>
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
        <p>You don't have any cosmetics yet. Add a cosmetic to see your categories. </p>
      )}
    </div>
  );
};

export default Home;


