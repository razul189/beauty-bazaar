//CosmeticEditForm.js
import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserContext";

function CosmeticEditForm({ cosmetic, setShowForm }) {
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
      // note: cosmetic.note || "",
      category_id: cosmetic.category_id,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      editCosmetic({ ...cosmetic, ...values });
      formik.resetForm();
      setShowForm(false);
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

      {/* <label>Note:</label>
      <input name="note" 
      value={formik.values.note} 
      onChange={formik.handleChange} />
      <p className="error">{formik.errors.note}</p> */}


      <label>Category:</label>
      <select
        name="category_id"
        value={formik.values.category_id}
        onChange={formik.handleChange}
      >
        <option value="">-- Choose One --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <p className="error">{formik.errors.category_id}</p>
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