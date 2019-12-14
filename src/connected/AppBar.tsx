import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

import { canUseAuth0, useAuth0 } from '../components/Auth0Provider';
import { AppState } from '../states/appState';
import logo from '../resources/logo.png';
import { VIEWER_LOGO_WIDTH, VIEWER_HEADER_BACKGROUND_COLOR, VIEWER_APP_NAME } from '../config';
import ServerDialog from './ServerDialog';
import SettingsDialog from './SettingsDialog';
import { openDialog } from '../actions/controlActions';


interface AppBarProps extends WithStyles<typeof styles> {
    appName: string;
    openDialog: (dialogId: string) => void;
}


// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        appName: VIEWER_APP_NAME,
    };
};

const mapDispatchToProps = {
    openDialog,
};


const styles = (theme: Theme) => createStyles(
    {
        toolbar: {
            backgroundColor: VIEWER_HEADER_BACKGROUND_COLOR,
        },
        toolbarIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...theme.mixins.toolbar,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        logo: {
            marginLeft: theme.spacing(1),
        },
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing(1),
        },
        orangeAvatar: {
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
    }
);

const _AppBar: React.FC<AppBarProps> = ({classes, appName, openDialog}: AppBarProps) => {

    const handleSettingsButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        openDialog('settings');
    };

    let userButton;
    if (canUseAuth0()) {

        const {isAuthenticated, user, loginWithRedirect, loading} = useAuth0();

        const handleSignInButtonCLicked = () => {
            loginWithRedirect({});
        };

        if (isAuthenticated) {
            let avatarContent: React.ReactNode = <FaceIcon/>;
            if (!user) {
                userButton = <Avatar className={classes.orangeAvatar}>?</Avatar>;
            } else if (user.picture) {
                userButton = <Avatar src={user.picture} alt={user.name}/>;
            } else {
                const name1 = user.given_name || user.name || user.nickname;
                const name2 = user.family_name;
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
                userButton = <Avatar className={classes.orangeAvatar}>{avatarContent}</Avatar>;
            }
        } else {
            userButton = (
                <IconButton onClick={loading ? undefined : handleSignInButtonCLicked}>
                    <FaceIcon/>
                </IconButton>
            );
            if (loading) {
                userButton = (
                    <div className={classes.signInWrapper}>
                        {userButton}
                        <CircularProgress size={30} className={classes.signInProgress}/>
                    </div>
                );
            }
        }
    }

    return (
        <AppBar
            position="absolute"
            className={classNames(classes.appBar)}
        >
            <Toolbar disableGutters={true} className={classes.toolbar}>
                <img src={logo} alt={'xcube logo'} width={VIEWER_LOGO_WIDTH} className={classes.logo}/>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    {appName}
                </Typography>
                {userButton}
                <IconButton onClick={handleSettingsButtonClicked}>
                    <SettingsApplicationsIcon/>
                </IconButton>
            </Toolbar>
            <ServerDialog/>
            <SettingsDialog/>
        </AppBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));
