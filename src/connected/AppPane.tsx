import * as React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import TimeSeriesChart from './TimeSeriesChart';
import SimpleTable from '../components/SimpleTable';
import { AppState } from '../states/appState';
import ControlBar from "./ControlBar";
import Viewer from './Viewer';
import { I18N } from '../config';
import TimeRangeControl from './TimeRangeControl';


interface AppPaneProps extends WithStyles<typeof styles> {
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = {};

const styles = (theme: Theme) => createStyles(
    {
        content: {
            flexGrow: 1,
            padding: theme.spacing.unit,
            height: '100vh',
            overflow: 'auto',
        },
        appBarSpacer: theme.mixins.toolbar,
        viewerContainer: {
            height: 400,
        },
        chartContainer: {
            marginLeft: -22,
        },
        tableContainer: {
            height: 320,
        },
        h5: {
            marginBottom: theme.spacing.unit * 2,
        },
    });

class AppPane extends React.Component<AppPaneProps> {

    render() {
        const {classes} = this.props;

        return (
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <ControlBar/>
                <div className={classes.viewerContainer}>
                    <Viewer/>
                </div>
                <Typography variant="h6" gutterBottom component="h5">
                    {I18N.text`Time-Series`}
                </Typography>
                <div className={classes.chartContainer}>
                    <TimeSeriesChart/>
                </div>
                <TimeRangeControl/>
                <Typography variant="h6" gutterBottom component="h5">
                    {I18N.text`Values`}
                </Typography>
                <div className={classes.tableContainer}>
                    <SimpleTable/>
                </div>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppPane));