import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

const CosmeticFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  brand: yup.string().required("Brand is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(1, "Price must be at least 1")
    .max(100, "Price must be 100 or less"),
  category_id: yup.number().required("Category ID is required"),
});

const ReviewForm = ({ user }) => {
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: CosmeticFormSchema,
    onSubmit: (values) => {
      fetch(`http://localhost:5555/api/cosmetics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then(() => navigate(-1))
        .catch((err) => console.error(err));
    },
  });

  return (
    <div className="container">
      <h1>Edit Cosmetic</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name && <p className="error">{formik.errors.name}</p>}

        <label htmlFor="brand">Brand</label>
        <input
          type="text"
          name="brand"
          value={formik.values.brand}
          onChange={formik.handleChange}
        />
        {formik.errors.brand && <p className="error">{formik.errors.brand}</p>}

        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        {formik.errors.description && <p className="error">{formik.errors.description}</p>}

        <label htmlFor="price">Price</label>
        <input
          type="number"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
        />
        {formik.errors.price && <p className="error">{formik.errors.price}</p>}

        <label htmlFor="category_id">Category ID</label>
        <input
          type="number"
          name="category_id"
          value={formik.values.category_id}
          onChange={formik.handleChange}
        />
        {formik.errors.category_id && <p className="error">{formik.errors.category_id}</p>}

        <button type="submit">Update Cosmetic</button>
      </form>
    </div>
  );
};

export default ReviewForm;

