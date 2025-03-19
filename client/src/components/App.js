import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import Authentication from "./Authentication";
import Categories from "./Categories"; // Lists all categories
import CategoryDetail from "./CategoryDetail"; // Shows a single category
import CategoryForm from "./CategoryForm"; // Creates a new category
import CosmeticDetail from "./CosmeticDetail";
import Cosmetic from "./Cosmetic";
import CosmeticCreate from "./CosmeticCreate";
import Providers from "./Providers";
import ProviderDetail from "./ProviderDetail";
import ProviderForm from "./ProviderForm";
import Users from "./Users";
import UserDetail from "./UserDetail";
import NotFound from "./NotFound";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
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
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        {/* Home & Auth Routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/auth" element={<Authentication setUser={setUser} />} />

        {/* Category Routes */}
        <Route
          path="/categories"
          element={
            <ProtectedRoute user={user}>
              <Categories user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/:id"
          element={
            <ProtectedRoute user={user}>
              <CategoryDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/new"
          element={
            <ProtectedRoute user={user}>
              <CategoryForm />
            </ProtectedRoute>
          }
        />

        {/* Cosmetic Routes */}
        <Route
          path="/cosmetics"
          element={
            <ProtectedRoute user={user}>
              <Cosmetic />
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
          path="/cosmetic/new"
          element={
            <ProtectedRoute user={user}>
              <CosmeticCreate />
            </ProtectedRoute>
          }
        />

        {/* Provider Routes */}
        <Route
          path="/providers"
          element={
            <ProtectedRoute user={user}>
              <Providers />
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
        <Route
          path="/provider/new"
          element={
            <ProtectedRoute user={user}>
              <ProviderForm />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
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

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;




