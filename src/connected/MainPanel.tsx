import * as React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import SimpleLineChart from '../components/SimpleLineChart';
import SimpleTable from '../components/SimpleTable';
import Viewer from '../components/Viewer';
import { AppState } from '../states/appState';
import { ComponentVisibility } from '../states/controlState';
import { changeComponentVisibility } from '../actions/controlActions';


interface MainPanelProps extends WithStyles<typeof styles> {
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
        content: {
            flexGrow: 1,
            padding: theme.spacing.unit * 3,
            // height: '100vh',
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

class MainPanel extends React.Component<MainPanelProps> {

    render() {
        const {classes} = this.props;

        return (
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <div className={classes.viewerContainer}>
                    <Viewer/>
                </div>
                <Typography variant="h6" gutterBottom component="h5">
                    Time-Series
                </Typography>
                <div className={classes.chartContainer}>
                    <SimpleLineChart/>
                </div>
                <Typography variant="h6" gutterBottom component="h5">
                    Values
                </Typography>
                <div className={classes.tableContainer}>
                    <SimpleTable/>
                </div>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MainPanel));