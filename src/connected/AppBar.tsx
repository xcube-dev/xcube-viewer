/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppBar, IconButton, Menu, MenuItem, Theme, Toolbar, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import classNames from 'classnames';
import MarkdownPage from '../components/MarkdownPage';

import { Config } from '../config';
import i18n from '../i18n';
import { AppState } from '../states/appState';
import { WithLocale } from '../util/lang';
import ExportDialog from './ExportDialog';
import ServerDialog from './ServerDialog';
import SettingsDialog from './SettingsDialog';
import UserControl from './UserControl';
import AddPlaceDialog from './UserPlacesDialog';
import { openDialog } from '../actions/controlActions';
import { updateResources } from "../actions/dataActions";
import { deepOrange } from '@mui/material/colors';


interface AppBarProps extends WithStyles<typeof styles>, WithLocale {
    appName: string;
    openDialog: (dialogId: string) => any;
    allowRefresh?: boolean;
    updateResources: () => any;
}


// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        appName: Config.instance.branding.appBarTitle,
        allowRefresh: Config.instance.branding.allowRefresh,
    };
};

const mapDispatchToProps = {
    openDialog,
    updateResources,
};


const styles = (theme: Theme) => createStyles(
    {
        toolbar: {
            backgroundColor: Config.instance.branding.headerBackgroundColor,
            paddingRight: theme.spacing(1),
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        logoAnchor: {
            display: "flex",
            alignItems: "center"
        },
        logo: {
            marginLeft: theme.spacing(1),
        },
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing(1),
            ...Config.instance.branding.headerTitleStyle,
        },
        imageAvatar: {
            width: 24,
            height: 24,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
        letterAvatar: {
            width: 24,
            height: 24,
            color: '#fff',
            backgroundColor: deepOrange[300],
        },
        signInWrapper: {
            margin: theme.spacing(1),
            position: 'relative',
        },
        signInProgress: {
            color: deepOrange[300],
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 1,
            marginTop: -12,
            marginLeft: -12,
        },
        iconButton: {
            marginLeft: theme.spacing(2),
            ...Config.instance.branding.headerIconStyle,
        }
    }
);

const _AppBar: React.FC<AppBarProps> = (
    {
        classes,
        appName,
        openDialog,
        allowRefresh,
        updateResources
    }: AppBarProps) => {
    const [helpMenuAnchorEl, setHelpMenuAnchorEl] = React.useState(null);
    const [imprintOpen, setImprintOpen] = React.useState(false);
    const [manualOpen, setManualOpen] = React.useState(false);

    const handleSettingsButtonClicked = () => {
        openDialog('settings');
    };

    const handleOpenHelpMenu = (event: any) => {
        setHelpMenuAnchorEl(event.currentTarget);
    };

    const handleCloseHelpMenu = () => {
        setHelpMenuAnchorEl(null);
    };

    const handleOpenManual = () => {
        handleCloseHelpMenu();
        setManualOpen(true);
    };

    const handleCloseManual = () => {
        setManualOpen(false);
    };

    const handleOpenImprint = () => {
        handleCloseHelpMenu();
        setImprintOpen(true);
    };

    const handleCloseImprint = () => {
        setImprintOpen(false);
    };

    const handleRefresh = () => {
        updateResources();
    };

    return (
        <AppBar
            position="absolute"
            className={classNames(classes.appBar)}
        >
            <Toolbar disableGutters className={classes.toolbar} variant="dense">
                <a
                    href={Config.instance.branding.organisationUrl || ""}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.logoAnchor}
                >
                    <img
                        src={Config.instance.branding.logoImage}
                        width={Config.instance.branding.logoWidth}
                        alt={'xcube logo'}
                        className={classes.logo}
                    />
                </a>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}
                >
                    {appName}
                </Typography>
                <UserControl/>
                {allowRefresh &&
                    <Tooltip arrow title={i18n.get('Refresh')}>
                        <IconButton onClick={handleRefresh} size="small" className={classes.iconButton}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip arrow title={i18n.get('Help')}>
                    <IconButton onClick={handleOpenHelpMenu} size="small" className={classes.iconButton}>
                        <HelpOutlineIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip arrow title={i18n.get('Settings')}>
                    <IconButton onClick={handleSettingsButtonClicked} size="small" className={classes.iconButton}>
                        <SettingsIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <ServerDialog/>
            <SettingsDialog/>
            <ExportDialog/>
            <AddPlaceDialog/>
            <Menu
                id="simple-menu"
                anchorEl={helpMenuAnchorEl}
                keepMounted
                open={Boolean(helpMenuAnchorEl)}
                onClose={handleCloseHelpMenu}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <MenuItem onClick={handleOpenManual}>{i18n.get('User Manual')}</MenuItem>
                <MenuItem onClick={handleOpenImprint}>{i18n.get('Imprint')}</MenuItem>
            </Menu>
            <MarkdownPage title={i18n.get('User Manual')}
                          href='manual.md'
                          open={manualOpen} onClose={handleCloseManual}/>
            <MarkdownPage title={i18n.get('Imprint')}
                          href='imprint.md'
                          open={imprintOpen} onClose={handleCloseImprint}/>
        </AppBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));
