import { createStyles, Theme } from '@material-ui/core';

const drawerWidth = 240;

export const toolbarStyles = (theme: Theme) => createStyles(
    {
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
    });

export const appBarStyles = (theme: Theme) => createStyles(
    {
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
    });

// noinspection JSUnusedLocalSymbols
export const menuButtonStyles = (theme: Theme) => createStyles(
    {
        menuButton: {
            marginLeft: 10,
            marginRight: 36,
        },
        menuButtonHidden: {
            display: 'none',
        },
    });

export const drawerStyles = (theme: Theme) => createStyles(
    {
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
            width: theme.spacing.unit * 5 + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing.unit * 7 + 1,
            },
        },
    });
