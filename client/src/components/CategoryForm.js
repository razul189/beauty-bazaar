import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const CategoryForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('http://localhost:5555/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          navigate('/categories'); // Navigate to categories list
        } else {
          console.error('Failed to create category');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <h1>Create Category</h1>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Create Category
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;