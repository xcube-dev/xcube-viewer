import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { AppState } from '../states/appState';
import { ComponentVisibility } from '../states/controlState';
import { changeComponentVisibility } from '../actions/controlActions';
import { appBarStyles, toolbarStyles } from './styles';


interface DashboardProps extends WithStyles<typeof styles> {
    componentVisibility: ComponentVisibility;
    changeComponentVisibility: (propertyName: string, visibility?: boolean) => void;
}

const mapStateToProps = (state: AppState) => {
    return {
        componentVisibility: state.controlState.componentVisibility,
    }
};

const mapDispatchToProps = {
    changeComponentVisibility,
};


const styles = (theme: Theme) => createStyles(
    {
        ...toolbarStyles(theme),
        ...appBarStyles(theme),
        title: {
            flexGrow: 1,
        },
    });

class _AppBar extends React.Component<DashboardProps> {

    handleSideMenuOpen = () => {
        this.props.changeComponentVisibility('sideMenu', true);
    };

    render() {
        const {classes, componentVisibility} = this.props;
        const sideMenuOpen = componentVisibility.sideMenu;
        return (
            <AppBar
                position="absolute"
                className={classNames(classes.appBar, sideMenuOpen && classes.appBarShift)}
            >
                <Toolbar disableGutters={!sideMenuOpen} className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        xcube Viewer
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));