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
            paddingRight: theme.spacing(1),
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
            margin: 10,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
    });

const _AppBar: React.FC<AppBarProps> = ({classes, appName, openDialog}) => {

    const handleSettingsButtonClicked = () => {
        openDialog('settings');
    };

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
            </Toolbar>
            <ServerDialog/>
            <SettingsDialog/>
        </AppBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));
