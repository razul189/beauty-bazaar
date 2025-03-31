//Home.js
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import CosmeticForm from "./CosmeticForm";
import CategoryLink from "./CategoryLink";

function Home() {
  const [displayCategories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false);
  const { user, loggedIn, categories } = useContext(UserContext);

  useEffect(()=> {
    console.log("user.categories",user)
    const CategoriesList = user.categories.map(c => <div key={c.id} ><CategoryLink category={c} /></div>)    
    setCategories(CategoriesList)
  }, [loggedIn, categories, user])

  if (!loggedIn) return <h3>Please log in to view your dashboard</h3>;

  return (
    <div>
      <h1>Welcome back, {user.username} 💖</h1>
      <h1>Your categories</h1>
      <section>
        {displayCategories}
      </section>
      <section>
        <button onClick={() => setShowForm(prev => !prev)}>
          {showForm ? "Cancel" : "➕ Add New Cosmetic"}
        </button>
        {showForm && <CosmeticForm setShowForm={setShowForm} />}
      </section>
    </div>
    
  );
}

export default Home;







