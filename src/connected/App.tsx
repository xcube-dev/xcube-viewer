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
import AppPane from './AppPane';
import LoadingDialog from "./LoadingDialog";


interface DashboardProps extends WithStyles<typeof styles> {
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = {};

const theme = createMuiTheme(
    {
        // TODO: make the theme part of configuration in src/config.ts
        palette: {
            type: 'dark',
        },
        // see https://material-ui.com/style/typography/#migration-to-typography-v2
        typography: {
            useNextVariants: true,
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
                    <AppPane/>
                    <LoadingDialog/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
