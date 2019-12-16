import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

import { AppState } from '../states/appState';
import { getBranding } from '../config';
import ServerDialog from './ServerDialog';
import SettingsDialog from './SettingsDialog';
import UserControl from './UserControl';
import { openDialog } from '../actions/controlActions';


interface AppBarProps extends WithStyles<typeof styles> {
    appName: string;
    openDialog: (dialogId: string) => void;
}


// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        appName: getBranding().appBarTitle,
    };
};

const mapDispatchToProps = {
    openDialog,
};


const styles = (theme: Theme) => createStyles(
    {
        toolbar: {
            backgroundColor: getBranding().headerBackgroundColor,
            paddingRight: theme.spacing(1)
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
        imageAvatar: {
            width: 24,
            height: 24,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
        letterAvatar: {
            width: 24,
            height: 24,
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

    const handleSettingsButtonClicked = () => {
        openDialog('settings');
    };

    render() {
        const {classes, appName} = this.props;
        return (
            <AppBar
                position="absolute"
                className={classNames(classes.appBar)}
            >
                <Toolbar disableGutters={true} className={classes.toolbar}>
                    <img
                        src={getBranding().logoPath}
                        width={getBranding().logoWidth}
                        alt={'xcube logo'}
                        className={classes.logo}
                    />
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {appName}
                    </Typography>
                    <IconButton onClick={handleSettingsButtonClicked}>
                        <SettingsApplicationsIcon/>
                    </IconButton>
                    <UserControl/>
                </Toolbar>
                <ServerDialog/>
                <SettingsDialog/>
            </AppBar>
        );
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
                <IconButton onClick={handleSettingsButtonClicked}>
                    <SettingsApplicationsIcon/>
                </IconButton>
                <UserControl/>
            </Toolbar>
            <ServerDialog/>
            <SettingsDialog/>
        </AppBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));
