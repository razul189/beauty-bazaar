import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";

function MyCategories() {
  const { user, loggedIn } = useContext(UserContext);
  const myCategories = user.categories || [];

  if (!loggedIn) return <h3>Please log in to see your categories</h3>;

  return (
    <div>
      <h1>My Categories</h1>
      {myCategories.length === 0 ? (
        <p>You haven’t added any cosmetics yet.</p>
      ) : (
        myCategories.map((category) => (
          <div key={category.id} style={linkStyle}>
            <Link to={`/my-categories/${category.id}`}>{category.name}</Link>
          </div>
        ))
      )}
    </div>
  );
}

const linkStyle = {
  marginBottom: "12px",
  fontSize: "18px",
};

export default MyCategories;


