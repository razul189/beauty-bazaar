import React, { useContext,useEffect,useState } from "react";
import { UserContext } from "./UserContext";
import CosmeticCard from "./CosmeticCard";
import { useParams, useNavigate } from 'react-router-dom'

function Cosmetics() {
  const { user, loggedIn } = useContext(UserContext);
  const {category_id, id} = useParams();
  const [cosmetic, setCosmetic] = useState({
    title: '',
    description: ''
})
  useEffect(() => {
    if (loggedIn){
      const selectedCategory = user.categories.find(c => c.id == category_id)
      const selectedCosmetic = selectedCategory.cosmetics.find(co => co.id == id)
      setCosmetic(selectedCosmetic)
    }
  }, [loggedIn])

  if (!loggedIn) return <h3>Please log in to see your cosmetics.</h3>;


  return (
    <div>
      <h1>All My Cosmetics</h1>
      <h3>Title: {cosmetic.title}</h3>
      <h3>Description: {cosmetic.description}</h3>
    </div>
  );
}

export default Cosmetics;


