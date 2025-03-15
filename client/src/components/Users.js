// User.js file
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/api/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Users</h1>
      {users.length > 0 ? (
        <div className="grid">
          {users.map((user) => (
            <div key={user.id} className="product-card">
              <h3>{user.username}</h3>
              <p>Email: {user.email}</p>
              <p>Username: {user.username}</p>
              <Link to={`/users/${user.id}`}>View User</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;