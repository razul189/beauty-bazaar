import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

function Authentication({ setUser }) {
  const [signUp, setSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setSignUp((prev) => !prev);
    setErrorMessage(""); // Clear error message when switching modes
  };

  const handleSubmit = (values) => {
    const url = signUp ? "http://localhost:5555/api/signup" : "http://localhost:5555/api/login";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else {
          return response.json().then(errorData => { // Parse error JSON
            throw new Error(JSON.stringify({status: response.status, message: errorData.error})); //Include status code, and message.
          });
        }
      })
      .then((data) => {
        setUser(data); // Store logged-in user state
        navigate("/"); // Redirect to homepage
      })
      .catch((error) => {
        try{
          const parsedError = JSON.parse(error.message);
          if(parsedError.status === 400 && signUp){
            setErrorMessage("User already registered.");
          } else if(parsedError.status === 401){
            setErrorMessage("Invalid Credentials. Please check username and password.");
          } else {
            setErrorMessage("An error occurred. Please try again.");
            console.error(error);
          }
        } catch(e){
          setErrorMessage("An error occurred. Please try again.");
          console.error(error);
        }
      });
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Please enter a username."),
    password: yup.string().required("Please enter a password."),
    // Email is only required during signup
    email: signUp ? yup.string().email("Invalid email address").required("Please enter an email.") : yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <h4>{signUp ? "Sign Up" : "Log In"}</h4>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {signUp && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        )}
        <input type="submit" value={signUp ? "Sign Up" : "Log In"} />
        <button type="button" onClick={toggleMode}>
          {signUp ? "Log In" : "Sign Up"}
        </button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {formik.errors && Object.keys(formik.errors).length > 0 && (
        <ul className="error-list">
          {Object.values(formik.errors).map((error, index) => (
            <li key={index} style={{ color: "red" }}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Authentication;