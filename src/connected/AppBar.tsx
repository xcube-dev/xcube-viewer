import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
// import { AppBar, Toolbar, Typography, IconButton, Badge } from '@material-ui/core';
// import NotificationsIcon from '@material-ui/icons/Notifications';
// import Avatar from '@material-ui/core/Avatar';

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
            margin: 10,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
    });

class _AppBar extends React.Component<AppBarProps> {

    handleSettingsButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.openDialog('settings');
    };

    render() {
        const {classes, appName} = this.props;
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
                    {/*<IconButton>*/}
                    {/*<Badge badgeContent={4} color={"secondary"}>*/}
                    {/*<NotificationsIcon/>*/}
                    {/*</Badge>*/}
                    {/*</IconButton>*/}
                    {/*<Avatar className={classes.orangeAvatar}>CL</Avatar>*/}
                    <IconButton onClick={this.handleSettingsButtonClicked}>
                        <SettingsApplicationsIcon/>
                    </IconButton>
                </Toolbar>
                <ServerDialog/>
                <SettingsDialog/>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));
