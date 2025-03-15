# Beauty Bazaar 🛍️💄

## Overview  
**Beauty Bazaar** is a **personal beauty product management application** that allows users to organize and track their beauty and skincare products. Users can **add cosmetics, categorize them, manage providers**, and keep track of their collection. Users can also view other uses products. The application features **authentication (sign up, login, logout)**, and protects certain pages from unauthorized access.

### **Core Features**
- **User Authentication** (Sign up, Log in, Log out)
- **Personal Dashboard** displaying beauty products
- **CRUD Operations** for:
  - **Cosmetics**: Add, update, delete, and categorize your products.
  - **Providers**: Store information about beauty providers.
  - **Categories**: Organize your cosmetics into categories.
- **Session Persistence** so users remain logged in
- **Protected Routes** for user-specific content
- **Flask API & SQLite Database** for storage

---

## **Project Structure**
This project is a **Flask + React** full-stack application. The backend is built with **Flask** and **SQLAlchemy**, while the frontend is developed using **React (with React Router)**.

### **Backend (Flask API)**
| File | Description |
|------|------------|
| `app.py` | Main application file that sets up the Flask app, database, API routes, and session management. Handles authentication and CRUD operations for cosmetics, categories, and providers. |
| `models.py` | Defines the database models (`User`, `Cosmetic`, `Provider`, `Category`, `CosmeticCategory`). |
| `config.py` | Handles Flask app configurations and database settings. |
| `seed.py` | Populates the database with sample data for development and testing. |

### **Frontend (React)**
| File | Description |
|------|------------|
| `index.js` | Entry point of the React app. Renders the `App.js` component. |
| `App.js` | Manages routing, user authentication, and session state. |
| `NavBar.js` | Displays navigation links for logged-in users. |
| `Home.js` | Displays a welcome page for new users and a dashboard for logged-in users. |
| `Authentication.js` | Handles login and signup functionality using Formik and Yup. |
| `Cosmetic.js` | Displays all cosmetics owned by the user. |
| `CosmeticDetail.js` | Displays and allows editing of an individual cosmetic item. |
| `CosmeticCreate.js` | Form for adding a new cosmetic. |
| `CategoryDetail.js` | Displays cosmetics within a specific category. |
| `CategoryForm.js` | Form for creating new categories. |
| `Providers.js` | Displays a list of providers. |
| `ProviderDetail.js` | Displays details about a provider. |
| `ProviderForm.js` | Form for adding a new provider. |
| `Users.js` | Displays a list of registered users. |
| `UserDetail.js` | Displays details about a specific user. |
| `ProtectedRoute.js` | Ensures that only logged-in users can access certain pages. |
| `NotFound.js` | Handles 404 errors. |
| `index.css` | Styles the entire application, including forms, buttons, and layout. |

---

## **Backend Details**
### **🔹 `app.py`**
The main Flask application that initializes the **Flask app, database, and API routes**.  
It handles:
- **User Authentication**: `Signup`, `Login`, and `Logout`
- **CRUD operations for Cosmetics, Categories, and Providers**
- **Session management**: Users remain logged in between requests.

#### **Main Routes**
| Route | Method | Description |
|--------|--------|-------------|
| `/api/signup` | `POST` | Registers a new user and starts a session. |
| `/api/login` | `POST` | Authenticates a user and starts a session. |
| `/api/logout` | `POST` | Logs out the current user and clears the session. |
| `/api/cosmetics` | `GET` | Retrieves all cosmetics owned by the logged-in user. |
| `/api/cosmetics/:id` | `GET` | Retrieves details of a specific cosmetic. |
| `/api/cosmetics` | `POST` | Creates a new cosmetic entry. |
| `/api/cosmetics/:id` | `PATCH` | Updates an existing cosmetic. |
| `/api/cosmetics/:id` | `DELETE` | Deletes a cosmetic item. |
| `/api/categories` | `GET` | Retrieves all categories. |
| `/api/category/new` | `POST` | Creates a new category. |
| `/api/providers` | `GET` | Retrieves all providers. |
| `/api/providers/:id` | `GET` | Retrieves provider details. |
| `/api/providers/new` | `POST` | Creates a new provider. |
| `/api/check_session` | `GET` | Checks if a user is logged in and returns their details. |

---

### **🔹 `models.py`**
Defines the **database schema** using SQLAlchemy ORM.

#### **Main Models**
- **`User`**
  - Stores user details (username, email, password)
  - Has a one-to-many relationship with **Cosmetics**
  - `authenticate(password)`: Checks if a password matches the stored password.
  
- **`Cosmetic`**
  - Stores beauty product details (name, brand, description, price)
  - Belongs to a **User**
  - Belongs to a **Provider**
  - Has a many-to-many relationship with **Categories**
  
- **`Provider`**
  - Stores provider information (name, contact info)
  - Has a one-to-many relationship with **Cosmetics**
  
- **`Category`**
  - Stores category names
  - Has a many-to-many relationship with **Cosmetics**
  
- **`CosmeticCategory`** (Join Table)
  - Many-to-many relationship between **Cosmetics** and **Categories**
  - Stores optional **notes** about the product-category relation.

---

## **Frontend Details**
### **🔹 `App.js`**
- Manages **user authentication** and **routes**.
- Fetches `/api/check_session` on page load to maintain login state.
- Defines **protected routes** using `ProtectedRoute`.

### **🔹 `Authentication.js`**
- Uses **Formik & Yup** for form validation.
- Handles **login & signup** requests.
- Stores user session on successful login.

### **🔹 `Home.js`**
- Shows **generic information** before login.
- Displays **dashboard-style content** for logged-in users.

### **🔹 `Cosmetic.js`**
- Fetches and displays all **user cosmetics**.
- Includes a **"New Cosmetic"** button for adding products.

### **🔹 `CosmeticDetail.js`**
- Displays **details of a single cosmetic**.
- Allows users to **edit or delete** cosmetics.
- Supports updating **categories and notes**.

### **🔹 `CosmeticCreate.js`**
- Allows users to **add a new cosmetic**.
- Uses **Formik & Yup** for validation.
- Fetches **providers** and **categories**.

### **🔹 `NavBar.js`**
- Shows different **navigation links** based on user login state.
- Allows users to **log out**.

### **🔹 `ProtectedRoute.js`**
- Redirects users to `/auth` if they are not logged in.
- Ensures that only **authenticated users** can access certain pages.

---

## **Getting Started**
### **Installation**
1. Clone the repository:  
   ```sh
   git clone https://github.com/razul189/beauty-bazaar.git
