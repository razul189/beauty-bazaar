// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Home from "./Home";
import MyCategoryDetail from "./MyCategoryDetail";
import Cosmetics from "./Cosmetics";
import Categories from "./Categories";
import { UserProvider } from "./UserContext";
import Login from "./Login";
import Category from "./Category";
import Signup from "./Signup";



function App() {
  return (
    <Router>
      <UserProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={ <Category  />}  />
          <Route path="/my-categories/:id" element={<MyCategoryDetail />} />
          <Route path="/cosmetics" element={<Cosmetics />} />
          <Route path="/categories/:category_id/cosmetics/:id" element={<Cosmetics />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;





