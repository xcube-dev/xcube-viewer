import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import * as auth from '../util/auth';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';

interface UserProfileProps extends WithLocale {
    idToken: auth.IdToken;
    accessToken: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({idToken, accessToken}) => {

    return (
        <Grid container justify="center" spacing={1}>
            <Grid item>
                <img src={idToken.picture} width={84} alt={I18N.get('User Profile')}/>
            </Grid>
            <Grid item>
                <Paper elevation={3}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={idToken.name}
                                secondary={I18N.get('User name')}/>
                        </ListItem>
                        <Divider light/>
                        <ListItem>
                            <ListItemText
                                primary={`${idToken.email} (${idToken.email_verified ? I18N.get('verified') : I18N.get('not verified')})`}
                                secondary={I18N.get('E-mail')}/>
                        </ListItem>
                        <Divider light/>
                        <ListItem>
                            <ListItemText
                                primary={idToken.nickname}
                                secondary={I18N.get('Nickname')}/>
                        </ListItem>
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default UserProfile;