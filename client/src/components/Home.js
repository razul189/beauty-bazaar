import React from "react";
import { Link } from "react-router-dom";

const Home = ({ user }) => {
  return (
    <div className="container">
      <h1>Welcome to Beauty Bazaar!</h1>

      {user ? (
        <>
          <h2>Hello, {user.username}! 👋</h2>
          <p>
            Beauty Bazaar is your go-to platform for managing your beauty and skincare products. 
            You can track your cosmetics, discover new providers, and organize products into categories. 💄✨
          </p>

          <h3>Quick Links:</h3>
          <div className="grid">
            <div className="product-card">
              <h3>📦 View Your Cosmetics</h3>
              <p>Manage your personal beauty collection.</p>
              <Link to="/cosmetics">Go to Cosmetics</Link>
            </div>
            
            <div className="product-card">
              <h3>🏬 Discover Providers</h3>
              <p>See all beauty product providers.</p>
              <Link to="/providers">Go to Providers</Link>
            </div>

            <div className="product-card">
              <h3>📂 Organize by Category</h3>
              <p>Group your cosmetics into categories.</p>
              <Link to="/categories">Go to Categories</Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>
            Beauty Bazaar helps you manage and track your beauty products easily. 
            Sign up or log in to get started. ✨
          </p>
          <Link to="/auth">
            <button>Login / Sign Up</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;


