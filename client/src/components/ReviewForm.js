import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Yup validation schema for the cosmetic form
const CosmeticSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  brand: Yup.string().required("Brand is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(1, "Price must be at least 1")
    .max(100, "Price must be 100 or less"),
  category_id: Yup.number().required("Category ID is required"),
});

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category_id: "",
  });

  useEffect(() => {
    // Fetch existing cosmetic data for editing
    fetch(`http://localhost:5555/api/cosmetics/${id}`)
      .then((r) => r.json())
      .then((data) =>
        setInitialValues({
          name: data.name,
          brand: data.brand,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
        })
      )
      .catch((err) => console.error(err));
  }, [id]);

  const onSubmit = (values) => {
    fetch(`http://localhost:5555/api/cosmetics/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((r) => r.json())
      .then(() => {
        navigate(-1);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h1>{id ? "Edit Cosmetic" : "Add Cosmetic"}</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={CosmeticSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <Field type="text" name="brand" />
              <ErrorMessage name="brand" component="div" />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Field type="text" name="description" />
              <ErrorMessage name="description" component="div" />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <Field type="number" name="price" />
              <ErrorMessage name="price" component="div" />
            </div>
            <div>
              <label htmlFor="category_id">Category ID</label>
              <Field type="number" name="category_id" />
              <ErrorMessage name="category_id" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {id ? "Update Cosmetic" : "Add Cosmetic"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReviewForm;
