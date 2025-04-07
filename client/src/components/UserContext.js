import React, { useState, useEffect, createContext } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({ categories: [] });
  const [categories, setCategories] = useState([])
  const [loggedIn, setLoggedIn] = useState(false);

  // Auto-login on mount
  useEffect(() => {
    fetch("/check_session")
      .then((res) => {
        if (res.status === 200) {
          return res.json(); 
        } else {
          return {};
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
    //console.log(userData)
    setCategories(userData.all_categories);
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
    setCategories(prev => [...prev, newCategory]);
  };
  
  const addCosmetic = (newCosmetic) => {
    fetch('/cosmetics', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCosmetic)
    })
    .then(r => r.json())
    .then(data => {
      let userCategories = [...user.categories]
      let category = userCategories.find(c => c.id == newCosmetic.category_id)
      if (!category){
        category = categories.find(c => c.id == newCosmetic.category_id)
        category = {...category, cosmetics: []}
        userCategories = [...user.categories, {...category, cosmetics: []}]
      } 
      const updatedCategory = {...category, cosmetics: [...category.cosmetics, data]}
      const updatedUserCategories = userCategories.map(c => c.id == category.id ? updatedCategory : c)
      const updatedCategories = {
        ...user,
        categories: updatedUserCategories
      }
      setUser(updatedCategories)
    })
  }

  const editCosmetic = (updatedCosmetic) => {
    fetch(`/cosmetics/${updatedCosmetic.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCosmetic),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const updatedCategories = user.categories.map((cat) => {
        if (cat.id === updatedCosmetic.category_id) {
          return {
            ...cat,
            cosmetics: cat.cosmetics.map((c) =>
              c.id === updatedCosmetic.id ? data : c
            ),
          };
        }
        return cat;
      });
  
      setUser((prev) => ({ ...prev, categories: updatedCategories }));
    })
    .catch((error) => {
      console.error('Error updating cosmetic:', error);
    });
  };

  const deleteCosmetic = (cosmetic) => {
    fetch(`/cosmetics/${cosmetic.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (!res.ok) throw new Error('Deletion failed');
      return res.json();
    })
    .then(() => {
      setUser(prevUser => {
        const updatedCategories = prevUser.categories.map(category => {
          if (category.id === cosmetic.category_id) {
            return {
              ...category,
              cosmetics: category.cosmetics.filter(cos => cos.id !== cosmetic.id)
            };
          }
          return category;
        });
        const filteredCategories = updatedCategories.filter(c => c.cosmetics.length > 0);
  
        return {
          ...prevUser,
          categories: filteredCategories
        };
      });
    })
    .catch(error => {
      console.error('Delete error:', error);
    });
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
        categories,
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


