import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import Authentication from "./Authentication"; // New file for signup & login
import CategoryDetail from "./CategoryDetail";
import CosmeticDetail from "./CosmeticDetail";
import ReviewForm from "./ReviewForm";
import NotFound from "./NotFound";

function App() {
  const [user, setUser] = useState(null);
  const [cosmetics, setCosmetics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/api/check_session") 
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/auth" element={<Authentication setUser={setUser} />} />
        <Route path="/categories/:id" element={<CategoryDetail cosmetics={cosmetics} setCosmetics={setCosmetics} />} />
        <Route path="/cosmetics/:id" element={<CosmeticDetail user={user} />} />
        <Route path="/reviews/new/:id" element={<ReviewForm user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

