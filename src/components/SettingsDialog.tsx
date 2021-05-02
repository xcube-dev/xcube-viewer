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

import React, { ChangeEvent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import SettingsPanel from './SettingsPanel';
import SettingsSubPanel from './SettingsSubPanel';
import ToggleSetting from './ToggleSetting';
import { I18N } from '../config';
import { ControlState, TIME_ANIMATION_INTERVALS, TimeAnimationInterval } from '../states/controlState';
import { ApiServerConfig, ApiServerInfo } from '../model/apiServer';
import { maps, MapGroup, MapSource } from '../util/maps';


const useStyles = makeStyles(theme => ({
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
    selectedServer: ApiServerConfig;
    viewerVersion: string;
    updateSettings: (settings: ControlState) => void;
    changeLocale: (locale: string) => void;
    openDialog: (dialogId: string) => void;
    serverInfo: ApiServerInfo | null;
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
                        <SettingsSubPanel label={I18N.get('Show dots only, hide lines')}
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

const getOnOff = (state: boolean): string => {
    return state ? I18N.get('On') : I18N.get('Off');
};

