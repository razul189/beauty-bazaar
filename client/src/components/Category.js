import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useParams, useNavigate } from "react-router-dom";
import CosmeticForm from "./CosmeticForm";
import CosmeticLink from "./CosmeticLink";

function Category() {
  const [category, setCategory] = useState({
    cosmetics: []
  });
  const [formFlag, setFormFlag] = useState(false);
  const { user, loggedIn, deleteCosmetic } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    if (loggedIn) {
      const selectedCategory = user.categories.find(c => c.id == id);
      if (selectedCategory) {
        const filteredCosmetics = selectedCategory.cosmetics;

        const updatedCategory = {
          ...selectedCategory,
          cosmetics: filteredCosmetics,
        };
        setCategory(updatedCategory);
      } else {
        navigate('/');
      }
    }
  }, [loggedIn, user, id, navigate]);

  const handleClick = () => {
    setFormFlag(formFlag => !formFlag);
  };

  const handleDelete = (cosmetic) => {
    deleteCosmetic(cosmetic);
    const updatedCategory = { ...category, cosmetics: category.cosmetics.filter(cos => cos.id !== cosmetic.id) };
    if (updatedCategory.cosmetics.length > 0) {
      setCategory(updatedCategory);
    } else {
      navigate('/categories');
    }
  };

  if (!loggedIn) {
    return (<div>Please login or signup</div>);
  }

  const categoryCosmetics = category.cosmetics.map(cosmetic => <CosmeticLink cosmetic={cosmetic} key={cosmetic.id} handleDelete={handleDelete} />);

  return (
    <>
      <h3>{category.name}</h3>
      <h3>
      </h3>
      <h3>Cosmetics:</h3>
      {categoryCosmetics}
      <br />
      {formFlag ? <CosmeticForm setFormFlag={setFormFlag} category={category} /> : <button onClick={handleClick}>Add Cosmetic</button>}
    </>
  );
}

export default Category;