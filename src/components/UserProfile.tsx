import React from 'react';
import { useAuth0 } from './Auth0Provider';

const UserProfile: React.FC = () => {
    const {loading, user, token} = useAuth0();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <img src={user.picture} alt="Profile"/>

            <h4>{user.name}</h4>
            <p>{user.email}</p>


            <h5>ID Token</h5>
            <code>{JSON.stringify(user, null, 2)}</code>

            <p>Access Token</p>
            <code>{token}</code>

        </div>
    );
};

export default UserProfile;