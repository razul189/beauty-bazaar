import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("http://localhost:5555/api/logout", { method: "DELETE" })
      .then(() => {
        setUser(null);
        navigate("/auth");
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav>
      <h2>Beauty Bazaar</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link to="/auth">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
