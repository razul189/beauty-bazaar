// Login.js
import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid username or password");
        })
        .then((user) => {
          login(user);
          navigate("/");
        })
        .catch((err) => setError(err.message));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Login</h2>

      <label>Username:</label>
      <input
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
      />
      <p className="error">{formik.errors.username}</p>

      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <p className="error">{formik.errors.password}</p>

      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Login;
