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
import { getBranding } from '../config';


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
            type: getBranding().themeName,
            primary: getBranding().primaryColor,
            secondary: getBranding().secondaryColor,
        },
    });

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        root: {
            display: 'flex',
        },
    });

const App: React.FC<DashboardProps> = ({classes}) => {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
