// CategoryEditForm.js 
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "./UserContext";

const CategoryEditForm = ({ category, setFormFlag }) => {
  const [editedCategory, setEditedCategory] = useState({ ...category }); // Corrected useState
  const { editCategory } = useContext(UserContext); // Removed user from context, if you need it, add it back.

  useEffect(() => {
    setEditedCategory({ ...category });
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedCategory((prevCategory) => ({
      ...prevCategory,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editCategory(editedCategory); 

      setFormFlag(false); 
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Category Name:
        <input
          type="text"
          name="name"
          value={editedCategory.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Favorite:
        <input
          type="checkbox"
          name="is_favorite"
          checked={editedCategory.is_favorite || false}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update</button>
      <button type="button" onClick={() => setFormFlag(false)}>Cancel</button>
    </form>
  );
};

export default CategoryEditForm;