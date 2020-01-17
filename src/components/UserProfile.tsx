import React from 'react';

import * as auth from '../util/auth';

interface UserProfileProps {
    idToken: auth.IdToken;
    accessToken: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({idToken, accessToken}) => {

    return (
        <div>
            <img src={idToken.picture} alt="Profile"/>

            <h4>{idToken.name}</h4>
            <p>{idToken.email}</p>


            <h5>ID Token</h5>
            <code>{JSON.stringify(idToken, null, 2)}</code>

            <h5>Access Token</h5>
            <code>{accessToken || '---'}</code>

        </div>
    );
};

export default UserProfile;