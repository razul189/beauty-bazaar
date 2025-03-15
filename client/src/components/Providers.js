//Provider.js file
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Providers = () => {
  const [providers, setProviders] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5555/api/providers", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProviders(data.data))
      .catch((err) => console.error(err));
  }, []);
  const handleNewProviderClick = () => {
    navigate("/provider/new");
  };

  return (
    <div className="container">
      <h1>Providers</h1>
      <button onClick={handleNewProviderClick}>New provider</button>
      {providers.length > 0 ? (
        <div className="grid">
          {providers.map((provider) => (
            <div key={provider.id} className="product-card">
              <h3>{provider.name}</h3>
              <p>Name: {provider.name}</p>
              <p>Info: {provider.info}</p>
              <Link to={`/providers/${provider.id}`}>View Provider</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No providers found. Add a provider to see them here.</p>
      )}
    </div>
  );
};

export default Providers;