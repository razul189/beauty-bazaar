import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserContext";

function CosmeticEditForm({ cosmetic, setFormFlag }) { // Receive setFormFlag
  const { editCosmetic, categories } = useContext(UserContext);

  const formSchema = yup.object().shape({
    title: yup.string().required("Title is required").min(3, "Too short"),
    description: yup.string(),
    category_id: yup.number().required("Please select a category"),
  });

  const formik = useFormik({
    initialValues: {
      title: cosmetic.title,
      description: cosmetic.description || "",
      note: cosmetic.note || "",
      category_id: cosmetic.category_id,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      editCosmetic({ ...cosmetic, ...values });
      formik.resetForm();
      setFormFlag(false); // Close the form here
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} style={formStyle}>
      <label>Title:</label>
      <input
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
      />
      <p className="error">{formik.errors.title}</p>

      <label>Description:</label>
      <textarea
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
      />
      <button type="submit">Update Cosmetic</button>
    </form>
  );
}

const formStyle = {
  marginTop: "16px",
  marginBottom: "24px",
  padding: "16px",
  background: "#f1f1f1",
  borderRadius: "8px",
};

export default CosmeticEditForm;