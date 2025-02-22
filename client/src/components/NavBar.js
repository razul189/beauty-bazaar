import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ user, setUser }) => {
  const handleLogout = () => {
    fetch("http://localhost:5555/api/logout", { method: "DELETE" })
      .then(() => setUser(null))
      .catch((err) => console.error(err));
  };

  return (
    <nav>
      <h2>Beauty Bazaar</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
