import * as React from 'react';
import { connect } from 'react-redux';
import {
    Theme,
    WithStyles,
    createStyles,
    withStyles,
    createMuiTheme,
    CssBaseline,
    MuiThemeProvider
} from '@material-ui/core';

import { AppState } from '../states/appState';
import AppBar from './AppBar';
import AppDrawer from './AppDrawer';
import AppPane from './AppPane';


interface DashboardProps extends WithStyles<typeof styles> {
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = {};

const theme = createMuiTheme(
    {
        palette: {
            type: 'dark',
        },
    });

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        root: {
            display: 'flex',
        },
    });

class App extends React.PureComponent<DashboardProps> {

    render() {
        const {classes} = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline/>
                    <AppBar/>
                    <AppDrawer/>
                    <AppPane/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
