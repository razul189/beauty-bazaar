import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CosmeticDetail = () => {
    const { id } = useParams();
    const [cosmetic, setCosmetic] = useState(null);
    const [providers, setProviders] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryNote, setCategoryNote] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5555/api/cosmetics/${id}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                setCosmetic(data);
                if (Array.isArray(data.categories)) {
                    setSelectedCategories(data.categories.map(cat => cat.name));
                    if (data.categories.length > 0 && data.categories[0].note !== null && data.categories[0].note !== undefined) {
                        setCategoryNote(data.categories[0].note);
                    } else {
                        setCategoryNote("");
                    }
                }
            })
            .catch((err) => console.error(err));

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
            .then((data) => 
              {
                console.log("data.data",data.data);
                setAllCategories(data.data);
              }
              )
            .catch((err) => console.error(err));
    }, [id]);

    if (!cosmetic) {
        return <div>Loading...</div>;
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        brand: Yup.string().required('Brand is required'),
        description: Yup.string(),
        provider: Yup.string().required('Provider is required'),
    });

    const handleSubmit = (values) => {
        const updatedCosmetic = {
            ...values,
            categories: selectedCategories,
            categoryNote: categoryNote,
        };

        fetch(`http://localhost:5555/api/cosmetics/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCosmetic),
            credentials: 'include',
        })
            .then((res) => {
                if (res.ok) {
                    navigate('/cosmetics');
                } else {
                    console.error('Failed to update cosmetic');
                }
            })
            .catch((err) => console.error(err));
    };

    const handleDelete = () => {
        fetch(`http://localhost:5555/api/cosmetics/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((res) => {
                if (res.ok) {
                    navigate('/cosmetics');
                } else {
                    console.error('Failed to delete cosmetic');
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
            <h1>Cosmetic Details</h1>
            <Formik
                initialValues={{
                    name: cosmetic.name,
                    brand: cosmetic.brand,
                    description: cosmetic.description,
                    provider: cosmetic.provider,
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

                        {/* ... (rest of the form remains the same) ... */}
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
                            Update Cosmetic
                        </button>
                    </Form>
                )}
            </Formik>
            <button
                onClick={handleDelete}
                style={{
                    marginTop: '10px',
                    backgroundColor: '#dc3545',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Delete Cosmetic
            </button>
        </div>
    );
};

export default CosmeticDetail;