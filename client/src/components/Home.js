import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import CosmeticCard from "./CosmeticCard";
import CosmeticForm from "./CosmeticForm";

function Home() {
  const { user, loggedIn } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);

  if (!loggedIn) return <h3>Please log in to view your dashboard</h3>;

  const categories = user.categories || [];
  const allCosmetics = categories.flatMap(cat => cat.cosmetics || []);
  const recent = [...allCosmetics].slice(-3).reverse();

  return (
    <div>
      <h1>Welcome back, {user.username} 💖</h1>

      <section>
        <p>You have <strong>{allCosmetics.length}</strong> cosmetics in <strong>{categories.length}</strong> categories.</p>
      </section>

      <section>
        <button onClick={() => setShowForm(prev => !prev)}>
          {showForm ? "Cancel" : "➕ Add New Cosmetic"}
        </button>
        {showForm && <CosmeticForm setShowForm={setShowForm} />}
      </section>

      <section style={{ marginTop: "30px" }}>
        <h3>🧴 Recently Added</h3>
        {recent.length > 0 ? (
          recent.map(c => <CosmeticCard key={c.id} cosmetic={c} />)
        ) : (
          <p>No cosmetics yet — let’s add your first!</p>
        )}
      </section>
    </div>
  );
}

export default Home;







