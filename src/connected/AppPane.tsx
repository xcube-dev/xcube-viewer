import * as React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, createStyles, withStyles, Toolbar } from '@material-ui/core';

import { AppState } from '../states/appState';
import ControlBar from './ControlBar';
import Workspace from './Workspace';


interface AppPaneProps extends WithStyles<typeof styles> {
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
    };
};

const mapDispatchToProps = {};

const styles = (theme: Theme) => createStyles(
    {
        main: {
            flexGrow: 1,
            padding: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            [theme.breakpoints.up('md')]: {
                overflow: 'hidden',
            },
        },
    });

const AppPane: React.FC<AppPaneProps> = ({classes}) => {
    // <Toolbar/>: Empty toolbar is a spacer, see docs https://material-ui.com/components/app-bar/
    return (
        <main className={classes.main}>
            <Toolbar variant="dense"/>
            <ControlBar/>
            <Workspace/>
        </main>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppPane));