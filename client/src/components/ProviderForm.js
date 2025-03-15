// ProviderForm.js file
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const ProviderForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    contactInfo: Yup.string().required('Contact Info is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    fetch('http://localhost:5555/api/providers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          navigate('/providers'); // Navigate to providers list or another appropriate route
        } else {
          alert('Failed to create provider');
        }
      })
      .catch((err) => alert('Failed to create provider'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <h1>Create Provider</h1>
      <Formik
        initialValues={{ name: '', contactInfo: '' }}
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
            <div>
              <label htmlFor="contactInfo">Contact Info</label>
              <Field type="text" name="contactInfo" />
              <ErrorMessage name="contactInfo" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Create Provider
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProviderForm;