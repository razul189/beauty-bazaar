# Beauty Bazaar


Welcome to **My Beauty Bazaar** — a full-stack web application that helps users keep track of their personal beauty product categories and cosmetics, complete with custom notes for each category. It’s built with a Flask backend and a React frontend, and features a many-to-many relationship between users and categories with a user-submittable attribute (`is_favorite`) that tracks whether a category is a user’s favorite.


---

## Features

- ✅ User Authentication (Signup, Login, Logout)
- ✅ Create and manage your own **categories** (e.g. Skincare, Makeup, Haircare)
- ✅ Add **cosmetics** to categories with descriptions and titles
- ✅ Full CRUD for cosmetics
- ✅ Mark categories as **favorites** per user
- ✅ React Router for client-side navigation
- ✅ Formik + Yup validation for all forms
- ✅ Backend session handling with Flask

---


## **Getting Started**
### **Installation**
1. Clone the repository:  
   ```sh
   git clone https://github.com/razul189/beauty-bazaar.git
2. Navigate to the project directory 
   ```sh
   cd beauty-bazaar
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   npm install
4. Start the backend server:
   ```sh
   cd server
   python app.py
5. Start the frontend:
   ```sh
   cd client
   npm start