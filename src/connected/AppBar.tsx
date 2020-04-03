import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
    AppBar,
    createStyles,
    IconButton,
    Menu,
    MenuItem,
    Theme,
    Toolbar,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { AppState } from '../states/appState';
import { getBranding, I18N } from '../config';
import ServerDialog from './ServerDialog';
import SettingsDialog from './SettingsDialog';
import UserControl from './UserControl';
import { openDialog } from '../actions/controlActions';
import { WithLocale } from '../util/lang';
import MarkdownPage from '../components/MarkdownPage';


interface AppBarProps extends WithStyles<typeof styles>, WithLocale {
    appName: string;
    openDialog: (dialogId: string) => void;
}


// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        appName: getBranding().appBarTitle,
    };
};

const mapDispatchToProps = {
    openDialog,
};


const styles = (theme: Theme) => createStyles(
    {
        toolbar: {
            backgroundColor: getBranding().headerBackgroundColor,
            paddingRight: theme.spacing(1)
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        logo: {
            marginLeft: theme.spacing(1),
        },
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing(1),
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
        }
    }
);

const _AppBar: React.FC<AppBarProps> = ({classes, appName, openDialog}: AppBarProps) => {
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

    return (
        <AppBar
            position="absolute"
            className={classNames(classes.appBar)}
        >
            <Toolbar disableGutters className={classes.toolbar} variant="dense">
                <img
                    src={getBranding().logoPath}
                    width={getBranding().logoWidth}
                    alt={'xcube logo'}
                    className={classes.logo}
                />
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    {appName}
                </Typography>
                <UserControl/>
                <Tooltip arrow title={I18N.get('Help')}>
                    <IconButton onClick={handleOpenHelpMenu} size="small" className={classes.iconButton}>
                        <HelpOutlineIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip arrow title={I18N.get('Settings')}>
                    <IconButton onClick={handleSettingsButtonClicked} size="small" className={classes.iconButton}>
                        <SettingsIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <ServerDialog/>
            <SettingsDialog/>
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
                <MenuItem onClick={handleOpenManual}>{I18N.get('User Manual')}</MenuItem>
                <MenuItem onClick={handleOpenImprint}>{I18N.get('Imprint')}</MenuItem>
            </Menu>
            <MarkdownPage title={I18N.get('User Manual')}
                          href='manual.md'
                          open={manualOpen} onClose={handleCloseManual}/>
            <MarkdownPage title={I18N.get('Imprint')}
                          href='imprint.md'
                          open={imprintOpen} onClose={handleCloseImprint}/>
        </AppBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(_AppBar));
