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
import LoadingDialog from './LoadingDialog';
import LegalAgreementDialog from './LegalAgreementDialog';
import MessageLog from './MessageLog';
import { VIEWER_PRIMARY_COLOR, VIEWER_SECONDARY_COLOR, VIEWER_THEME } from "../config";


interface DashboardProps extends WithStyles<typeof styles> {
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = {};

const theme = createMuiTheme(
    {
        typography: {
            fontSize: 12,
            htmlFontSize: 14,
        },
        palette: {
            type: VIEWER_THEME,
            primary: VIEWER_PRIMARY_COLOR,
            secondary: VIEWER_SECONDARY_COLOR,
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
                    <MessageLog/>
                    <LegalAgreementDialog/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
