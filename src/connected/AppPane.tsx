import * as React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';

import { AppState } from '../states/appState';
import ControlBar from "./ControlBar";
import Viewer from './Viewer';
import TimeSeriesCharts from "./TimeSeriesCharts";


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
            padding: theme.spacing.unit,
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            [theme.breakpoints.up('md')]: {
                height: '100vh',
                overflow: 'hidden',
            },
        },
        appBarSpacer: theme.mixins.toolbar,
        contentContainer: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
            },
        },
        viewerContainer: {
            overflow: 'hidden',
            width: '50%',
            height: '100%',
            [theme.breakpoints.down('md')]: {
                width: '100%',
                height: '60%',
            },
        },
        chartContainer: {
            width: '50%',
            overflowX: 'hidden',
            overflowY: 'auto',
            paddingLeft: '8px',
            [theme.breakpoints.down('md')]: {
                width: '100%',
            },
        },
    });

class AppPane extends React.Component<AppPaneProps> {

    render() {
        const {classes} = this.props;

        return (
            <main className={classes.main}>
                <div className={classes.appBarSpacer}/>
                <ControlBar/>
                <div className={classes.contentContainer}>
                    <div className={classes.viewerContainer}>
                        <Viewer/>
                    </div>
                    <div className={classes.chartContainer}>
                        <TimeSeriesCharts/>
                    </div>
                </div>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppPane));