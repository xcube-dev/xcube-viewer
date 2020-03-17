import * as React from 'react';
import Transition from 'react-transition-group/Transition';
import {
    Theme,
    WithStyles,
    createStyles,
    withStyles,
} from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import UserProfile from '../components/UserProfile';
import * as auth from '../util/auth';
import { I18N } from '../config';
import { WithLocale } from '../util/lang';

const styles = (theme: Theme) => createStyles(
    {
        imageAvatar: {
            width: 32,
            height: 32,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
        letterAvatar: {
            width: 32,
            height: 32,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
        signInWrapper: {
            margin: theme.spacing(1),
            position: 'relative',
        },
        signInProgress: {
            color: deepOrange[300],
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 1,
            marginTop: -12,
            marginLeft: -12,
        },
        iconButton: {
            padding: 0,
        }
    }
);


interface UserControlProps extends WithStyles<typeof styles>, WithLocale {
    hasAuthClient: boolean;
    isBusy: boolean,
    idToken: auth.IdToken | null;
    accessToken: string | null;
    signIn: () => void;
    signOut: () => void;
}

const UserControl: React.FC<UserControlProps> = ({
                                                     classes,
                                                     hasAuthClient,
                                                     isBusy,
                                                     idToken,
                                                     accessToken,
                                                     signIn,
                                                     signOut,
                                                 }) => {

    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);

    if (!hasAuthClient) {
        return null;
    }

    const handleUserProfileMenuItemClicked = () => {
        handleUserMenuClose();
        setProfileDialogOpen(true);
    };

    const handleUserProfileDialogClose = () => {
        setProfileDialogOpen(false);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleSignInButtonClicked = () => {
        signIn();
    };

    const handleSignOutMenuItemClicked = () => {
        handleUserMenuClose();
        signOut();
    };

    if (idToken !== null) {
        let avatar;
        let avatarContent: React.ReactNode = <PersonIcon/>;
        if (!idToken) {
            avatar = <Avatar className={classes.letterAvatar}>?</Avatar>;
        } else if (idToken.picture) {
            avatar = <Avatar className={classes.imageAvatar} src={idToken.picture} alt={idToken.name}/>;
        } else {
            const name1 = idToken.given_name || idToken.name || idToken.nickname;
            const name2 = idToken.family_name;
            let letters: string | null = null;
            if (name1 && name2) {
                letters = name1[0] + name2[0];
            } else if (name1) {
                letters = name1[0];
            } else if (name2) {
                letters = name2[0];
            }
            if (letters !== null) {
                avatarContent = letters.toUpperCase();
            }
            avatar = <Avatar className={classes.letterAvatar}>{avatarContent}</Avatar>;
        }
        return (
            <React.Fragment>
                <IconButton
                    onClick={handleUserMenuOpen}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    size="small"
                    className={classes.iconButton}
                >
                    {avatar}
                </IconButton>
                <Menu
                    id="user-menu"
                    anchorEl={userMenuAnchorEl}
                    keepMounted
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                >
                    <MenuItem onClick={handleUserProfileMenuItemClicked}>{I18N.get('Profile')}</MenuItem>
                    <MenuItem onClick={handleSignOutMenuItemClicked}>{I18N.get('Log out')}</MenuItem>
                </Menu>
                <Dialog
                    open={profileDialogOpen}
                    TransitionComponent={Transition as any}
                    keepMounted
                    onClose={handleUserProfileDialogClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{I18N.get('User Profile')}</DialogTitle>
                    <DialogContent>
                        <UserProfile idToken={idToken!} accessToken={accessToken}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUserProfileDialogClose} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    } else {
        let userButton = (
            <IconButton onClick={isBusy ? undefined : handleSignInButtonClicked}  size="small">
                <PersonIcon/>
            </IconButton>
        );
        if (isBusy) {
            userButton = (
                <div className={classes.signInWrapper}>
                    {userButton}
                    <CircularProgress size={24} className={classes.signInProgress}/>
                </div>
            );
        }
        return userButton;
    }
};

export default withStyles(styles)(UserControl);
