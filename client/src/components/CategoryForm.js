import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function CategoryForm({ onCategoryCreated }) {
  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Category name is required")
      .min(2, "Must be at least 2 characters"),
  });

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw new Error("Failed to create category");
        })
        .then((newCategory) => {
          onCategoryCreated(newCategory);
          resetForm();
        })
        .catch((err) => console.error(err));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>Category Name:</label>
      <input
        type="text"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
      />
      {formik.errors.name && (
        <p style={{ color: "red" }}>{formik.errors.name}</p>
      )}
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CategoryForm;

