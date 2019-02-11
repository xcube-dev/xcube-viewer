import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Drawer, Divider, IconButton } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { AppState } from '../states/appState';
import { ComponentVisibility } from '../states/controlState';
import { changeComponentVisibility } from '../actions/controlActions';
import { toolbarStyles, drawerStyles } from './styles';
import ControlPanelList from './ControlPanelList';
import UserPlacesList from './UserPlacesList';


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
        ...drawerStyles(theme),
    });

class AppDrawer extends React.Component<DashboardProps> {

    handleSideMenuClose = () => {
        this.props.changeComponentVisibility('sideMenu', false);
    };

    render() {
        const {classes, componentVisibility} = this.props;
        const sideMenuOpen = componentVisibility.sideMenu;

        return (
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: sideMenuOpen,
                    [classes.drawerClose]: !sideMenuOpen,
                })}
                classes={{
                    paper: classNames({
                                          [classes.drawerOpen]: sideMenuOpen,
                                          [classes.drawerClose]: !sideMenuOpen,
                                      }),
                }}
                open={sideMenuOpen}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={this.handleSideMenuClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <ControlPanelList/>
                <Divider/>
                <UserPlacesList/>
            </Drawer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppDrawer));