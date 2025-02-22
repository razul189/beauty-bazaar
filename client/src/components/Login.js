import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    fetch("http://localhost:5555/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((r) => {
        if (r.ok) return r.json();
        else throw new Error("Login failed");
      })
      .then((data) => {
        setUser(data);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Invalid login credentials.");
      });
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
