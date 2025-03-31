//Navigation.js
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";


const linkStyle = {
  padding: "10px",
  margin: "5px",
  background: "lightblue",
  color: "black",
  textDecoration: "none",
  borderRadius: "6px",
};

function Navigation() {
  const { user, loggedIn, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("/logout", { method: "DELETE" }).then(() => {
      logout();
      navigate("/");
    });
  };

  return (
    <nav style={{ marginBottom: "20px" }}>
      {loggedIn ? (
        <>
          <h3>Hello, {user.username}!</h3>
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/categories" style={linkStyle}>
            Categories
          </NavLink>
          <button onClick={handleLogout} style={{ ...linkStyle, background: "tomato" }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/signup" style={linkStyle}>
            Signup
          </NavLink>
          <NavLink to="/login" style={linkStyle}>
            Login
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default Navigation;
