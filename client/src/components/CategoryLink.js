import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "./UserContext"; 

const CategoryLink = ({ category }) => {
  const { deleteCategory } = useContext(UserContext); 
  return (
    <div>
      <Link to={`/category/${category.id}`} key={category.id}>
        {category.name}
      </Link>
    </div>
  );
};

export default CategoryLink;