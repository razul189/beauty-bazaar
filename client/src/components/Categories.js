import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import CategoryForm from "./CategoryForm";

function Categories() {
  const { loggedIn } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch all categories from backend
  useEffect(() => {
    fetch("/categories")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to load categories");
        }
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowForm(false);
  };

  if (!loggedIn) return <h3>Please log in to view categories</h3>;

  return (
    <div>
      <h1>All Categories</h1>

      {categories.length === 0 ? (
        <p>No categories yet. Be the first to create one!</p>
      ) : (
        categories.map((cat) => (
          <div key={cat.id} style={catStyle}>
            <Link to={`/my-categories/${cat.id}`}>{cat.name}</Link>
          </div>
        ))
      )}

      <br />

      {showForm ? (
        <CategoryForm onCategoryCreated={handleAddCategory} />
      ) : (
        <button onClick={() => setShowForm(true)}>➕ Add New Category</button>
      )}
    </div>
  );
}

const catStyle = {
  fontSize: "18px",
  padding: "8px 0",
};

export default Categories;


