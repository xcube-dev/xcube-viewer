import * as React from 'react';
import { Theme, WithStyles, createStyles, withStyles } from "@material-ui/core";
import { CssBaseline, Drawer, AppBar, Toolbar, Typography, Divider, IconButton, Badge } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import classNames from "classnames";

import PrimaryDrawerList from './PrimaryDrawerList';
import SecondaryDrawerList from "./SecondaryDrawerList";
import SimpleLineChart from './SimpleLineChart';
import SimpleTable from './SimpleTable';
import Viewer from "./Viewer";

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles(
    {
        root: {
            display: 'flex',
        },
        toolbar: {
            paddingRight: 24, // keep right padding when drawer closed
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
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginLeft: 12,
            marginRight: 36,
        },
        menuButtonHidden: {
            display: 'none',
        },
        title: {
            flexGrow: 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing.unit * 7 + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing.unit * 9 + 1,
            },
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            padding: theme.spacing.unit * 3,
            // height: '100vh',
            overflow: 'auto',
        },
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

interface DashboardProps extends WithStyles<typeof styles> {
}

interface DashboardState {
    open: boolean;
    isDatasetsSelected?: boolean;
    isLayersSelected?: boolean;
    isRegionsSelected?: boolean;
    isTimeSelected?: boolean;
    isTimeseriesSelected?: boolean;
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {


    constructor(props: Readonly<DashboardProps>) {
        super(props);
        this.state = {
            open: false,
        };
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    private onDatasetsSelected = () =>  {
        const isDatasetsSelected = !this.state.isDatasetsSelected;
        this.setState({isDatasetsSelected,  isLayersSelected: !isDatasetsSelected, isRegionsSelected: !isDatasetsSelected});
    };

    private onLayersSelected= () =>  {
        const isLayersSelected = !this.state.isLayersSelected;
        this.setState({isLayersSelected,  isDatasetsSelected: !isLayersSelected, isRegionsSelected: !isLayersSelected});
    };

    private onRegionsSelected= () =>  {
        const isRegionsSelected = !this.state.isRegionsSelected;
        this.setState({isRegionsSelected,  isDatasetsSelected: !isRegionsSelected, isLayersSelected: !isRegionsSelected});
    };

    private onTimeSelected= () =>  {
        const isTimeSelected = !this.state.isTimeSelected;
        this.setState({isTimeSelected});
    };

    private onTimeseriesSelected= () =>  {
        const isTimeseriesSelected = !this.state.isTimeseriesSelected;
        this.setState({isTimeseriesSelected});
    };



    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, this.state.open && classes.menuButtonHidden)}
                        >
                            <MenuIcon/>
                        </IconButton>
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
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: classNames({
                                              [classes.drawerOpen]: this.state.open,
                                              [classes.drawerClose]: !this.state.open,
                                          }),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <PrimaryDrawerList
                        isDatasetsSelected={!!this.state.isDatasetsSelected}
                        onDatasetsSelected={this.onDatasetsSelected}
                        isLayersSelected={!!this.state.isLayersSelected}
                        onLayersSelected={this.onLayersSelected}
                        isRegionsSelected={!!this.state.isRegionsSelected}
                        onRegionsSelected={this.onRegionsSelected}
                        isTimeSelected={!!this.state.isTimeSelected}
                        onTimeSelected={this.onTimeSelected}
                        isTimeseriesSelected={!!this.state.isTimeseriesSelected}
                        onTimeseriesSelected={this.onTimeseriesSelected}
                    />
                    <Divider/>
                    <SecondaryDrawerList/>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>
                    <div className={classes.viewerContainer}>
                        <Viewer/>
                    </div>
                    <Typography variant="h4" gutterBottom component="h2">
                        Time-Series
                    </Typography>
                    <div className={classes.chartContainer}>
                        <SimpleLineChart/>
                    </div>
                    <Typography variant="h4" gutterBottom component="h2">
                        Values
                    </Typography>
                    <div className={classes.tableContainer}>
                        <SimpleTable/>
                    </div>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);