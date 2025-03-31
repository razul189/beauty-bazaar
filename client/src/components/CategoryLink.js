//CategoryLink.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "./UserContext"; 
import CategoryEditForm from './CategoryEditForm'; 

const CategoryLink = ({ category }) => {
  const [formFlag, setFormFlag] = useState(false);
  const { deleteCategory } = useContext(UserContext); 
  return (
    <div>
      <Link to={`/category/${category.id}`} key={category.id}>
        {category.name}
      </Link>
      <span>
       <button onClick={() => deleteCategory(category)} style={{ margin: '10px' }}>X</button>
      <button onClick={() => setFormFlag((formFlag) => !formFlag)} style={{ margin: '5px' }}>
  Edit
</button>      </span>
      {formFlag ? <CategoryEditForm category={category} setFormFlag={setFormFlag} /> : null}
    </div>
  );
};

export default CategoryLink;