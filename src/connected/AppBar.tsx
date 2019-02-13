import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';

import { AppState } from '../states/appState';
import { appBarStyles, toolbarStyles } from './styles';

import logo from "../resources/cube-icon.png";

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
        ...toolbarStyles(theme),
        ...appBarStyles(theme),
        logo: {
            marginLeft: theme.spacing.unit * 2,
        },
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing.unit,
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
                    <img src={logo} alt={"xcube logo"} width={32} className={classes.logo}/>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {appName}
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit">
                        <SettingsIcon/>
                    </IconButton>
                    <IconButton color="inherit">
                        <HelpIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));