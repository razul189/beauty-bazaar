//CosmeticCreate.js file
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CosmeticCreate = () => {
    const [providers, setProviders] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryNote, setCategoryNote] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5555/api/providers', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setProviders(data.data))
            .catch((err) => console.error(err));

        fetch('http://localhost:5555/api/all_categories', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setAllCategories(data.data))
            .catch((err) => console.error(err));
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        brand: Yup.string().required('Brand is required'),
        description: Yup.string(),
        provider: Yup.string().required('Provider is required'),
    });

    const handleSubmit = (values) => {
        const newCosmetic = {
            ...values,
            categories: selectedCategories,
            categoryNote: categoryNote,
        };

        fetch('http://localhost:5555/api/cosmetics', { // POST to create
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCosmetic),
            credentials: 'include',
        })
            .then((res) => {
                if (res.ok) {
                    navigate('/cosmetics');
                } else {
                    console.error('Failed to create cosmetic');
                }
            })
            .catch((err) => console.error(err));
    };

    const handleCategoryChange = (categoryName) => {
        if (selectedCategories.includes(categoryName)) {
            setSelectedCategories(selectedCategories.filter((name) => name !== categoryName));
        } else {
            setSelectedCategories([...selectedCategories, categoryName]);
        }
    };

    const handleNoteChange = (e) => {
        setCategoryNote(e.target.value);
    };

    return (
        <div>
            <h1>Create Cosmetic</h1>
            <Formik
                initialValues={{
                    name: '',
                    brand: '',
                    description: '',
                    provider: providers.length > 0 ? providers[0].name : '', // Default to first provider
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label>Categories:</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {allCategories.map((category) => (
                                    <label
                                        key={category.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: '10px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            value={category.name}
                                            checked={selectedCategories.includes(category.name)}
                                            onChange={() => handleCategoryChange(category.name)}
                                            style={{ marginRight: '5px' }}
                                        />
                                        {category.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label>Category Note:</label>
                            <textarea
                                value={categoryNote}
                                onChange={handleNoteChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="name">Name</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" className="error" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <label htmlFor="brand">Brand</label>
                            <Field type="text" name="brand" />
                            <ErrorMessage name="brand" component="div" className="error" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <Field as="textarea" name="description" />
                            <ErrorMessage name="description" component="div" className="error" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <label htmlFor="provider">Provider</label>
                            <Field as="select" name="provider">
                                {providers.map((provider) => (
                                    <option key={provider.id} value={provider.name}>
                                        {provider.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="provider" component="div" className="error" style={{ color: 'red' }} />
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                            Create Cosmetic
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CosmeticCreate;