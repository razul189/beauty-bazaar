import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import CosmeticCard from "./CosmeticCard";

function Cosmetics() {
  const { user, loggedIn } = useContext(UserContext);

  if (!loggedIn) return <h3>Please log in to see your cosmetics.</h3>;

  // ✅ Flatten all cosmetics across categories
  const allCosmetics = (user.categories || []).flatMap(
    (cat) => cat.cosmetics || []
  );

  return (
    <div>
      <h1>All My Cosmetics</h1>
      {allCosmetics.length === 0 ? (
        <p>You haven’t added any cosmetics yet! Try creating one from the home page!</p>
      ) : (
        allCosmetics.map((cosmetic) => (
          <CosmeticCard key={cosmetic.id} cosmetic={cosmetic} />
        ))
      )}
    </div>
  );
}

export default Cosmetics;


