import * as React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';

import { AppState } from '../states/appState';
import Viewer from './Viewer';
import TimeSeriesCharts from './TimeSeriesCharts';
import InfoCard from './InfoCard';


interface WorkspaceProps extends WithStyles<typeof styles> {
    hasInfoCard: boolean;
    hasTimeseries: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        hasInfoCard: state.controlState.infoCardOpen
                     && state.controlState.selectedDatasetId !== null
                     && state.dataState.datasets.length > 0,
        hasTimeseries: state.dataState.timeSeriesGroups.length > 0,
    };
};

const mapDispatchToProps = {};

const styles = (theme: Theme) => createStyles(
    {
        contentContainer: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            overflowY: 'hidden',
            [theme.breakpoints.down('md')]: {
                display: 'block',
                overflowY: 'auto',
            },
        },

        chartContainer: {
            width: '50%',
            overflowX: 'hidden',
            overflowY: 'auto',
            paddingLeft: theme.spacing(1),
            [theme.breakpoints.down('md')]: {
                width: '100%',
                paddingLeft: 0,
                overflowY: 'hidden',
            },
        },

        viewerContainer: {
            overflow: 'hidden',
            width: '50%',
            height: '100%',
            [theme.breakpoints.down('md')]: {
                width: '100%',
                height: '60vh',
            },
        },

        viewerContainer2: {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        },

    });

const Workspace: React.FC<WorkspaceProps> = ({
                                                 classes,
                                                 hasInfoCard,
                                                 hasTimeseries
                                             }) => {
    if (hasInfoCard || hasTimeseries) {
        return (
            <div className={classes.contentContainer}>
                <div className={classes.viewerContainer}>
                    <Viewer/>
                </div>
                <div className={classes.chartContainer}>
                    <InfoCard/>
                    <TimeSeriesCharts/>
                </div>
            </div>
        );
    } else {
        return (
            <div className={classes.viewerContainer2}>
                <Viewer/>
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Workspace));