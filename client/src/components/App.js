import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import CosmeticDetail from "./components/CosmeticDetail";
import ReviewForm from "./components/ReviewForm";
import Login from "./components/Login";
import CategoryDetail from "./components/CategoryDetail";
import NotFound from "./components/NotFound";

function App() {
  const [cosmetics, setCosmetics] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/api/cosmetics")
      .then((r) => r.json())
      .then((data) => setCosmetics(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5555/api/check_session")
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("Not logged in");
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={user ? <Home cosmetics={cosmetics} /> : <Login setUser={setUser} />} />
        <Route path="/cosmetics/:id" element={<CosmeticDetail />} />
        <Route path="/categories/:id" element={<CategoryDetail cosmetics={cosmetics} />} />
        <Route path="/reviews/edit/:id" element={<ReviewForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

