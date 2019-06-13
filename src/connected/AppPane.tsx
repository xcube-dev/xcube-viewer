import * as React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';

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
        appBarSpacer: theme.mixins.toolbar,
    });

class AppPane extends React.Component<AppPaneProps> {

    render() {
        const {classes} = this.props;

        return (
            <main className={classes.main}>
                <div className={classes.appBarSpacer}/>
                <ControlBar/>
                <Workspace/>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppPane));