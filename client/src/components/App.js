import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import Authentication from "./Authentication";
import CategoryDetail from "./CategoryDetail";
import CosmeticDetail from "./CosmeticDetail";
import NotFound from "./NotFound";
import Cosmetic from "./Cosmetic"
import Providers from "./Providers";
import Users from "./Users"
import CosmeticCreate from "./CosmeticCreate"
import UserDetail from "./UserDetail";
import ProviderForm from "./ProviderForm"
import ProviderDetail from "./ProviderDetail";
import CategoryForm from "./CategoryForm";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [cosmetics, setCosmetics] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5555/api/check_session", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        console.log("Session check data:", data);
        setUser(data); 
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false)); 
  }, []);
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/auth" element={<Authentication setUser={setUser} />} />
        <Route
          path="/categories/:id"
          element={
            <ProtectedRoute user={user}>
              <CategoryDetail cosmetics={cosmetics} setCosmetics={setCosmetics} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmetics/:id"
          element={
            <ProtectedRoute user={user}>
              <CosmeticDetail user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmetics"
          element={
            <ProtectedRoute user={user}>
              <Cosmetic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/providers"
          element={
            <ProtectedRoute user={user}>
              <Providers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute user={user}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute user={user}>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/categories" element={
          <ProtectedRoute user={user}>
          <Home user={user} />
        </ProtectedRoute>} />
        <Route
          path="/category/new"
          element={
            <ProtectedRoute user={user}>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmetic/new"
          element={
            <ProtectedRoute user={user}>
              <CosmeticCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/new"
          element={
            <ProtectedRoute user={user}>
              <ProviderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/providers/:id"
          element={
            <ProtectedRoute user={user}>
              <ProviderDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;



