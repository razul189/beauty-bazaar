//CosmeticForm.js 
import React, { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserContext";

function CosmeticForm({ setFormFlag, category, setCategory, cosmetic = null, editing = false }) {
  const { addCosmetic, editCosmetic, categories, user } = useContext(UserContext);

  const formSchema = yup.object().shape({
    title: yup.string().required("Title is required").min(3, "Too short"),
    description: yup.string(),
    // note: yup.string().max(100, "Note too long"),
    category_id: yup.number().required("Please select a category"),

  });

  const formik = useFormik({
    initialValues: {
      title: cosmetic ? cosmetic.title : "",
      description: cosmetic ? cosmetic.description : "",
      // note: cosmetic ? cosmetic.note : "",
      category_id: cosmetic ? cosmetic.category_id : category?.id || "",
       },
    validationSchema: formSchema,
    // In CosmeticForm.js
onSubmit: (values) => {
  const newCosmetic = {
    ...values,
    user_id: user.id,
  };

  if (editing) {
    editCosmetic({ ...cosmetic, ...newCosmetic });
  } else {
    addCosmetic(newCosmetic);
  }
  formik.resetForm();
  setFormFlag(false);
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
      <input
        name="note"
        value={formik.values.note}
        onChange={formik.handleChange}
      />
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

      <button type="submit">{editing ? "Update" : "Add"} Cosmetic</button>
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

export default CosmeticForm;