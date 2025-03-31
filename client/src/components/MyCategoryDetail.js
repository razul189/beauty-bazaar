//MyCategoryDetail.js
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import CosmeticCard from "./CosmeticCard";

function MyCategoryDetail() {
  const { user } = useContext(UserContext);
  const { id } = useParams();

  const category = (user.categories || []).find((cat) => cat.id === id);

  if (!category) return <h3>Category not found or has no cosmetics.</h3>;

  return (
    <div>
      <h1>{category.name}</h1>
      {category.cosmetics.length > 0 ? (
        category.cosmetics.map((cosmetic) => (
          <CosmeticCard key={cosmetic.id} cosmetic={cosmetic} />
        ))
      ) : (
        <p>No cosmetics in this category yet.</p>
      )}
    </div>
  );
}

export default MyCategoryDetail;
