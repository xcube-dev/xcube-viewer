import React, { ChangeEvent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

import { I18N } from '../config';
import { ControlState, TIME_ANIMATION_INTERVALS, TimeAnimationInterval } from '../states/controlState';
import { Server, ServerInfo } from '../model/server';
import { maps, MapGroup, MapSource } from '../util/maps';


const useStyles = makeStyles(theme => ({
        settingsPanelTitle: {
            marginBottom: theme.spacing(1),
        },
        settingsPanelPaper: {
            backgroundColor: (theme.palette.type === 'dark' ? lighten : darken)(theme.palette.background.paper, 0.1),
            marginBottom: theme.spacing(2),
        },
        settingsPanelList: {
            margin: 0,
        },
        settingsPanelListItem: {},
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            fontSize: theme.typography.fontSize / 2
        },
        intTextField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            fontSize: theme.typography.fontSize / 2,
            width: theme.spacing(6),
        },

        localeAvatar: {
            margin: 10,
        }
    }
));

interface SettingsDialogProps {
    open: boolean;
    closeDialog: (dialogId: string) => void;

    settings: ControlState;
    selectedServer: Server;
    viewerVersion: string;
    updateSettings: (settings: ControlState) => void;
    changeLocale: (locale: string) => void;
    openDialog: (dialogId: string) => void;
    serverInfo: ServerInfo | null;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
                                                           open,
                                                           closeDialog,
                                                           settings,
                                                           selectedServer,
                                                           updateSettings,
                                                           changeLocale,
                                                           openDialog,
                                                           viewerVersion,
                                                           serverInfo
                                                       }) => {
    const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState(null);
    const [baseMapMenuAnchor, setBaseMapMenuAnchor] = React.useState(null);
    const [timeChunkSize, setTimeChunkSize] = React.useState(settings.timeChunkSize + '');
    const classes = useStyles();

    React.useEffect(() => {
        const newTimeChunkSize = parseInt(timeChunkSize);
        if (!Number.isNaN(newTimeChunkSize) && newTimeChunkSize !== settings.timeChunkSize) {
            updateSettings({...settings, timeChunkSize: newTimeChunkSize});
        }
    }, [timeChunkSize, settings, updateSettings]);

    if (!open) {
        return null;
    }

    function handleCloseDialog() {
        closeDialog('settings');
    }

    function handleOpenServerDialog() {
        openDialog('server');
    }

    function handleTimeAnimationIntervalChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        updateSettings({...settings, timeAnimationInterval: parseInt(event.target.value) as TimeAnimationInterval});
    }

    function handleTimeChunkSizeChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setTimeChunkSize(event.target.value);
    }

    let localeMenuItems = null;
    if (Boolean(languageMenuAnchor)) {
        localeMenuItems = Object.getOwnPropertyNames(I18N.languages).map(langLocale => {
            const langName = I18N.languages[langLocale];
            return (
                <MenuItem
                    button
                    key={langLocale}
                    selected={langLocale === settings.locale}
                    onClick={() => changeLocale(langLocale)}
                >
                    <ListItemText primary={langName}/>
                </MenuItem>
            );
        });
    }

    function handleLanguageMenuOpen(event: any) {
        setLanguageMenuAnchor(event.currentTarget);
    }

    function handleLanguageMenuClose() {
        setLanguageMenuAnchor(null);
    }

    let baseMapMenuItems: null | React.ReactElement[] = null;
    if (Boolean(baseMapMenuAnchor)) {
        baseMapMenuItems = [];
        maps.forEach((mapGroup: MapGroup, i: number) => {
            baseMapMenuItems!.push(<ListSubheader key={i} disableSticky={true}>{mapGroup.name}</ListSubheader>);
            mapGroup.datasets.forEach((mapSource: MapSource, j: number) => {
                baseMapMenuItems!.push(
                    <MenuItem
                        button
                        key={i + '.' + j}
                        selected={settings.baseMapUrl === mapSource.endpoint}
                        onClick={() => updateSettings({...settings, baseMapUrl: mapSource.endpoint})}>
                        <ListItemText primary={mapSource.name}/>
                    </MenuItem>
                );
            });
        });
    }

    function handleBaseMapMenuOpen(event: any) {
        setBaseMapMenuAnchor(event.currentTarget);
    }

    function handleBaseMapMenuClose() {
        setBaseMapMenuAnchor(null);
    }

    let baseMapLabel = settings.baseMapUrl;
    maps.forEach((mapGroup: MapGroup) => {
        mapGroup.datasets.forEach((mapSource: MapSource) => {
            if (mapSource.endpoint === settings.baseMapUrl) {
                baseMapLabel = `${mapGroup.name} / ${mapSource.name}`;
            }
        });
    });

    return (
        <div>
            <Dialog
                open={open}
                fullWidth
                maxWidth={'sm'}
                onClose={handleCloseDialog}
                scroll='body'
            >
                <DialogTitle>{I18N.get('Settings')}</DialogTitle>
                <DialogContent>

                    <SettingsPanel title={I18N.get('General')}>
                        <SettingsSubPanel
                            label={I18N.get('Server')}
                            value={selectedServer.name}
                            onClick={handleOpenServerDialog}>
                        </SettingsSubPanel>
                        <SettingsSubPanel
                            label={I18N.get('Language')}
                            value={I18N.languages[settings.locale]}
                            onClick={handleLanguageMenuOpen}>
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('Time interval of the player')}>
                            <TextField
                                select
                                className={classes.textField}
                                value={settings.timeAnimationInterval}
                                onChange={handleTimeAnimationIntervalChange}
                                margin="normal"
                            >
                                {TIME_ANIMATION_INTERVALS.map((value, i) => (
                                    <MenuItem key={i} value={value}>{value + ' ms'}</MenuItem>
                                ))}
                            </TextField>
                        </SettingsSubPanel>
                    </SettingsPanel>

                    <SettingsPanel title={I18N.get('Time-Series')}>
                        <SettingsSubPanel label={I18N.get('Show graph after adding a place')}
                                          value={getOnOff(settings.autoShowTimeSeries)}>
                            <ToggleSetting
                                propertyName={'autoShowTimeSeries'}
                                settings={settings}
                                updateSettings={updateSettings}
                            />
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('Show data points only')}
                                          value={getOnOff(settings.showTimeSeriesPointsOnly)}>
                            <ToggleSetting
                                propertyName={'showTimeSeriesPointsOnly'}
                                settings={settings}
                                updateSettings={updateSettings}
                            />
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('Show error bars')}
                                          value={getOnOff(settings.showTimeSeriesErrorBars)}>
                            <ToggleSetting
                                propertyName={'showTimeSeriesErrorBars'}
                                settings={settings}
                                updateSettings={updateSettings}
                            />
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('Show median instead of mean (disables error bars)')}
                                          value={getOnOff(settings.showTimeSeriesMedian)}>
                            <ToggleSetting
                                propertyName={'showTimeSeriesMedian'}
                                settings={settings}
                                updateSettings={updateSettings}
                            />
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('Number of data points in a time series update')}>
                            <TextField
                                className={classes.intTextField}
                                value={timeChunkSize}
                                onChange={handleTimeChunkSizeChange}
                                margin="normal"
                                size={'small'}
                            />
                        </SettingsSubPanel>
                    </SettingsPanel>

                    <SettingsPanel title={I18N.get('Map')}>
                        <SettingsSubPanel
                            label={I18N.get('Base map')}
                            value={baseMapLabel}
                            onClick={handleBaseMapMenuOpen}>
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('Image smoothing')}
                                          value={getOnOff(settings.imageSmoothingEnabled)}>
                            <ToggleSetting
                                propertyName={'imageSmoothingEnabled'}
                                settings={settings}
                                updateSettings={updateSettings}
                            />
                        </SettingsSubPanel>
                    </SettingsPanel>

                    <SettingsPanel title={I18N.get('System Information')}>
                        <SettingsSubPanel label={`xcube Viewer ${I18N.get('version')}`}
                                          value={viewerVersion}/>
                        <SettingsSubPanel label={`xcube Server ${I18N.get('version')}`}
                                          value={serverInfo ? serverInfo.version : I18N.get('Cannot reach server')}/>
                    </SettingsPanel>
                </DialogContent>
            </Dialog>

            <Menu
                anchorEl={languageMenuAnchor}
                keepMounted
                open={Boolean(languageMenuAnchor)}
                onClose={handleLanguageMenuClose}
            >
                {localeMenuItems}
            </Menu>

            <Menu
                anchorEl={baseMapMenuAnchor}
                keepMounted
                open={Boolean(baseMapMenuAnchor)}
                onClose={handleBaseMapMenuClose}
            >
                {baseMapMenuItems}
            </Menu>

        </div>
    );
};

export default SettingsDialog;

interface SettingsPanelProps {
    title: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
    const classes = useStyles();

    const childCount = React.Children.count(props.children);

    const listItems: React.ReactNode[] = [];
    React.Children.forEach(props.children, (child: React.ReactNode, index: number) => {
        listItems.push(child);
        if (index < childCount - 1) {
            listItems.push(<Divider key={childCount + index} variant="fullWidth" component="li"/>);
        }
    });

    return (
        <Box>
            <Typography variant='body1' className={classes.settingsPanelTitle}>
                {props.title}
            </Typography>
            <Paper elevation={4} className={classes.settingsPanelPaper}>
                <List component="nav" dense={true} className={classes.settingsPanelList}>
                    {listItems}
                </List>
            </Paper>
        </Box>
    );
};

interface SettingsSubPanelProps {
    label: string;
    value?: string | number;
    onClick?: (event: any) => void;
}

const SettingsSubPanel: React.FC<SettingsSubPanelProps> = (props) => {
    const classes = useStyles();

    const listItemText = (<ListItemText primary={props.label} secondary={props.value}/>);

    let listItemSecondaryAction;
    if (props.children) {
        listItemSecondaryAction = (
            <ListItemSecondaryAction>
                {props.children}
            </ListItemSecondaryAction>
        );
    }

    if (!!props.onClick) {
        return (
            <ListItem button onClick={props.onClick} className={classes.settingsPanelListItem}>
                {listItemText}
                {listItemSecondaryAction}
            </ListItem>
        );
    }

    return (
        <ListItem className={classes.settingsPanelListItem}>
            {listItemText}
            {listItemSecondaryAction}
        </ListItem>
    );
};


interface ToggleSettingProps {
    propertyName: keyof ControlState;
    settings: ControlState;
    updateSettings: (settings: ControlState) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({propertyName, settings, updateSettings}) => {
    return (
        <Switch
            checked={!!settings[propertyName]}
            onChange={() => updateSettings({...settings, [propertyName]: !settings[propertyName]})}
        />
    );
};

const getOnOff = (state: boolean) => {
    return state ? I18N.get('On') : I18N.get('Off');
};

