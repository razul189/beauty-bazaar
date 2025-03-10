import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5555/api/users/${id}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            {user && (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <h2>Cosmetics:</h2>
                    {user.cosmetics && user.cosmetics.length > 0 ? (
                        <ul>
                            {user.cosmetics.map((cosmetic) => (
                                <li key={cosmetic.id}>
                                    {cosmetic.name} - Brand: {cosmetic.brand}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>This user has no cosmetics.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDetail;