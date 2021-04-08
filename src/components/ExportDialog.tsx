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

import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import React, { ChangeEvent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { I18N } from '../config';
import { ControlState } from '../states/controlState';
import SettingsPanel from './SettingsPanel';
import SettingsSubPanel from './SettingsSubPanel';
import ToggleSetting from './ToggleSetting';

const useStyles = makeStyles(theme => ({
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            fontSize: theme.typography.fontSize / 2
        },
    }
));

interface ExportDialogProps {
    open: boolean;
    closeDialog: (dialogId: string) => any;
    settings: ControlState;
    updateSettings: (settings: Partial<ControlState>) => any;
    downloadTimeSeries: () => any;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
                                                       open,
                                                       closeDialog,
                                                       settings,
                                                       updateSettings,
                                                       downloadTimeSeries,
                                                   }) => {
    const [formatMenuAnchor, setFormatMenuAnchor] = React.useState(null);
    const classes = useStyles();

    const handleCloseDialog = () => {
        closeDialog('export');
    }

    function handleFileNameChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        updateSettings({exportFileName: event.target.value});
    }

    const handleFormatChange = (exportFormat: "GeoJSON" | "CSV") => {
        handleFormatMenuClose();
        updateSettings({exportFormat});
    }

    const handleFormatMenuOpen = (event: any) => {
        setFormatMenuAnchor(event.currentTarget);
    }

    const handleFormatMenuClose = () => {
        setFormatMenuAnchor(null);
    }

    const handleDoExport = () => {
        handleCloseDialog();
        downloadTimeSeries();
    }

    let formatMenuItems: null | React.ReactElement[] = null;
    if (Boolean(formatMenuAnchor)) {
        formatMenuItems = [
            <MenuItem
                button
                selected={settings.exportFormat === "GeoJSON"}
                onClick={() => handleFormatChange("GeoJSON")}
            >
                <ListItemText primary={"GeoJSON"}/>
            </MenuItem>,
            <MenuItem
                button
                selected={settings.exportFormat === "CSV"}
                onClick={() => handleFormatChange("CSV")}
            >
                <ListItemText primary={"CSV"}/>
            </MenuItem>
        ];
    }

    return (
        <div>
            <Dialog
                open={open}
                fullWidth
                maxWidth={'xs'}
                onClose={handleCloseDialog}
                scroll='body'
            >
                <DialogContent>
                    <SettingsPanel title={I18N.get('Export Settings')}>
                        <SettingsSubPanel
                            label={I18N.get('File format')}
                            value={settings.exportFormat}
                            onClick={handleFormatMenuOpen}
                        />
                        <SettingsSubPanel
                            label={I18N.get('One file per graph')}
                            value={getOnOff(settings.exportMultiFile)}
                        >
                            <ToggleSetting
                                propertyName={'exportMultiFile'}
                                settings={settings}
                                updateSettings={updateSettings}
                            />
                        </SettingsSubPanel>
                        <SettingsSubPanel
                            label={I18N.get('As ZIP archive')}
                            value={getOnOff(settings.exportZipArchive || settings.exportMultiFile)}
                        >
                            <ToggleSetting
                                propertyName={'exportZipArchive'}
                                settings={settings}
                                updateSettings={updateSettings}
                                disabled={settings.exportMultiFile}
                            />
                        </SettingsSubPanel>
                        <SettingsSubPanel label={I18N.get('File name')}>
                            <TextField
                                className={classes.textField}
                                value={settings.exportFileName}
                                onChange={handleFileNameChange}
                                margin="normal"
                                size={'small'}
                            />
                        </SettingsSubPanel>
                    </SettingsPanel>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleDoExport}
                        color={'primary'}
                        disabled={!canDownload(settings)}
                    >
                        {I18N.get('Download')}
                    </Button>
                </DialogActions>

            </Dialog>

            <Menu
                anchorEl={formatMenuAnchor}
                open={Boolean(formatMenuAnchor)}
                onClose={handleFormatMenuClose}
            >
                {formatMenuItems}
            </Menu>

        </div>
    );
}

export default ExportDialog;


const getOnOff = (state: boolean): string => {
    return state ? I18N.get('On') : I18N.get('Off');
};

const isValidFileName = (fileName: string) => {
    return /^[0-9a-zA-Z_-]+$/.test(fileName);
}

const canDownload = (settings: ControlState) => {
    return isValidFileName(settings.exportFileName)
           // TODO (forman): implement CSV export
           && settings.exportFormat === "GeoJSON";
}
