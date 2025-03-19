// ProviderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProviderDetail = () => {
    const { id } = useParams();
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5555/api/providers/${id}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setProvider(data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!provider) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Provider Details</h1>
            {provider && (
                <div>
                    <p>Name: {provider.name}</p>
                    <p>Contact Info: {provider.contact_info}</p>
                    <h2>Cosmetics:</h2>
                    {provider.cosmetics && provider.cosmetics.length > 0 ? (
                        <ul>
                            {provider.cosmetics.map((cosmetic) => (
                                <li key={cosmetic.id}>
                                    {cosmetic.name} - Brand: {cosmetic.brand}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>This provider has no cosmetics.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProviderDetail;