import React from 'react';
import { useAuth0 } from './Auth0Provider';

const Profile: React.FC = () => {
    const {loading, user} = useAuth0();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            <img src={user.picture} alt="Profile"/>

            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <code>{JSON.stringify(user, null, 2)}</code>
        </React.Fragment>
    );
};

export default Profile;