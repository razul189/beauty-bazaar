// src/components/Signup.js
import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required").min(6, "Min 6 characters"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Signup failed");
        })
        .then((user) => {
          signup(user);
          navigate("/");
        })
        .catch((err) => setError(err.message));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Sign Up</h2>

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

      <label>Confirm Password:</label>
      <input
        type="password"
        name="password_confirmation"
        value={formik.values.password_confirmation}
        onChange={formik.handleChange}
      />
      <p className="error">{formik.errors.password_confirmation}</p>

      <button type="submit">Sign Up</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Signup;
