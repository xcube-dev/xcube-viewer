import React from 'react';
import { useAuth0 } from './Auth0Provider';

const UserProfile: React.FC = () => {
    const {loading, user} = useAuth0();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <img src={user.picture} alt="Profile"/>

            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <code>{JSON.stringify(user, null, 2)}</code>
        </div>
    );
};

export default UserProfile;