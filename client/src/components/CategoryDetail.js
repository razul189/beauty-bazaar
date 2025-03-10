import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CategoryDetail = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5555/api/categories/${id}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setCategory(data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!category) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Category: {category.name}</h1>
            <h2>Products:</h2>
            {category.cosmetics && category.cosmetics.length > 0 ? (
                <ul>
                    {category.cosmetics.map((cosmetic) => (
                        <li key={cosmetic.id}>
                            {cosmetic.name} - Brand: {cosmetic.brand}
                            {cosmetic.note && ` - Note: ${cosmetic.note}`}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products in this category.</p>
            )}
        </div>
    );
};

export default CategoryDetail;