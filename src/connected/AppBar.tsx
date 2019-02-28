import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreVert from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { AppState } from '../states/appState';
import logo from "../resources/logo.png";
import { VIEWER_LOGO_WIDTH, VIEWER_HEADER_BACKGROUND_COLOR } from "../config";


interface DashboardProps extends WithStyles<typeof styles> {
    appName: string;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        appName: state.configState.appName,
    };
};

const mapDispatchToProps = {};


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
            marginLeft: theme.spacing.unit,
        },
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing.unit,
        },
        orangeAvatar: {
            margin: 10,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
    });

class _AppBar extends React.Component<DashboardProps> {

    render() {
        const {classes, appName} = this.props;
        return (
            <AppBar
                position="absolute"
                className={classNames(classes.appBar)}
            >
                <Toolbar disableGutters={true} className={classes.toolbar}>
                    <img src={logo} alt={"xcube logo"} width={VIEWER_LOGO_WIDTH} className={classes.logo}/>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {appName}
                    </Typography>
                    <IconButton>
                        <Badge badgeContent={4} color={"secondary"}>
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <Avatar className={classes.orangeAvatar}>CL</Avatar>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));