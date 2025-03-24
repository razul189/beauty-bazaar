import React, { useState, useEffect, createContext } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({ categories: [] });
  const [loggedIn, setLoggedIn] = useState(false);

  // Auto-login on mount
  useEffect(() => {
    fetch("/check_session")
      .then((res) => {
        if (res.status === 200) {
          return res.json(); // Only parse if there’s a body
        } else {
          return {}; // Safe fallback
        }
      })
      .then((data) => {
        if (data.id) {
          login(data); 
        }
      })
      .catch((err) => console.error("Check session failed:", err));
  }, []);
  
  

  const login = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const logout = () => {
    fetch("/logout", {
      method: "DELETE",
    }).then(() => {
      setUser({ categories: [] });
      setLoggedIn(false);
    });
  };

  const signup = (userData) => login(userData);

  const addCategory = (newCategory) => {
    setUser((prevUser) => ({
      ...prevUser,
      categories: [...prevUser.categories, { ...newCategory, cosmetics: [] }],
    }));
  };

  const addCosmetic = (newCosmetic) => {
    const updatedCategories = user.categories.map((cat) => {
      if (cat.id === newCosmetic.category_id) {
        return {
          ...cat,
          cosmetics: [...cat.cosmetics, newCosmetic],
        };
      }
      return cat;
    });

    setUser((prev) => ({ ...prev, categories: updatedCategories }));
  };

  const editCosmetic = (updatedCosmetic) => {
    const updatedCategories = user.categories.map((cat) => {
      if (cat.id === updatedCosmetic.category_id) {
        return {
          ...cat,
          cosmetics: cat.cosmetics.map((c) =>
            c.id === updatedCosmetic.id ? updatedCosmetic : c
          ),
        };
      }
      return cat;
    });

    setUser((prev) => ({ ...prev, categories: updatedCategories }));
  };

  const deleteCosmetic = (cosmeticToDelete) => {
    const updatedCategories = user.categories
      .map((cat) => {
        if (cat.id === cosmeticToDelete.category_id) {
          const updatedCosmetics = cat.cosmetics.filter(
            (c) => c.id !== cosmeticToDelete.id
          );
          return { ...cat, cosmetics: updatedCosmetics };
        }
        return cat;
      })
      .filter((cat) => cat.cosmetics.length > 0); // remove empty categories if desired

    setUser((prev) => ({ ...prev, categories: updatedCategories }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        signup,
        loggedIn,
        categories: user.categories,
        addCategory,
        addCosmetic,
        editCosmetic,
        deleteCosmetic,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };


