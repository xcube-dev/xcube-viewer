/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 by the xcube development team and contributors.
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
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

import { WithLocale } from '../util/lang';
import i18n from '../i18n';
import { Config } from '../config';
import { FileUpload } from './FileUpload';
import { ControlState, UserPlacesFormatName, UserPlacesFormatOptions } from '../states/controlState';
import GeoJsonOptionsEditor from './user-place/GeoJsonOptionsEditor';
import CsvOptionsEditor from './user-place/CsvOptionsEditor';
import WktOptionsEditor from './user-place/WktOptionsEditor';
import { geoJsonFormat, GeoJsonOptions } from '../model/user-place/geojson';
import { csvFormat, CsvOptions } from '../model/user-place/csv';
import { wktFormat, WktOptions } from '../model/user-place/wkt';
import { Format, detectFormatName } from '../model/user-place/common';
import { FormControlLabel } from '@material-ui/core';


// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles(theme => (
        {
            spacer: {
                flexGrow: 1.0,
            },
            actionBox: {
                paddingTop: theme.spacing(0.5),
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            },
            actionButton: {
                marginRight: theme.spacing(1),
            },
            error: {
                fontSize: 'small'
            }
        }
));

interface UserPlacesDialogProps extends WithLocale {
    open: boolean;
    closeDialog: (dialogId: string) => void;
    userPlacesFormatName: UserPlacesFormatName,
    userPlacesFormatOptions: UserPlacesFormatOptions;
    updateSettings: (settings: Partial<ControlState>) => void;
    addUserPlacesFromText: (userPlacesText: string) => void;
}

const UserPlacesDialog: React.FC<UserPlacesDialogProps> = (
        {
            open,
            closeDialog,
            userPlacesFormatName,
            userPlacesFormatOptions,
            updateSettings,
            addUserPlacesFromText
        }) => {

    const [userPlacesText, setUserPlacesText] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [_userPlacesFormatName, setUserPlacesFormatName] = React.useState(userPlacesFormatName);
    const [_userPlacesFormatOptions, setUserPlacesFormatOptions] = React.useState(userPlacesFormatOptions);
    const classes = useStyles();

    React.useEffect(() => {
        setUserPlacesFormatName(userPlacesFormatName);
    }, [userPlacesFormatName]);

    React.useEffect(() => {
        setUserPlacesFormatOptions(userPlacesFormatOptions);
    }, [userPlacesFormatOptions]);

    if (!open) {
        return null;
    }

    const handleConfirm = () => {
        closeDialog('addUserPlacesFromText');
        updateSettings({
                           userPlacesFormatName: _userPlacesFormatName,
                           userPlacesFormatOptions: _userPlacesFormatOptions,
                       });
        addUserPlacesFromText(userPlacesText);
    };

    const handleClose = () => {
        closeDialog('addUserPlacesFromText');
    };

    const handleClear = () => {
        setUserPlacesText('');
    };

    const handleFileSelect = (selection: File[]) => {
        const file = selection[0];
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const text = reader.result as string;
            setUserPlacesFormatName(detectFormatName(text))
            setUserPlacesText(text);
            setLoading(false);
        };
        reader.onabort = reader.onerror = () => {
            setLoading(false);
        };
        reader.readAsText(file, 'UTF-8');
    };

    const handleDropFile = () => {
        setUserPlacesText('');
    }

    const handleTextAreaChange = (value: string) => {
        setUserPlacesText(value);
        setError(format.checkError(value));
    };

    function handleFormatNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserPlacesFormatName(e.target.value as UserPlacesFormatName);
    }

    function updateGeoJsonOptions(options: Partial<GeoJsonOptions>) {
        setUserPlacesFormatOptions({
            ...userPlacesFormatOptions,
            geojson: {
                ...userPlacesFormatOptions.geojson,
                ...options
            }
        });
    }

    function updateCsvOptions(options: Partial<CsvOptions>) {
        setUserPlacesFormatOptions({
                                       ...userPlacesFormatOptions,
                                       csv: {
                                           ...userPlacesFormatOptions.csv,
                                           ...options
                                       }
                                   });
    }

    function updateWktOptions(options: Partial<WktOptions>) {
        setUserPlacesFormatOptions({
                                       ...userPlacesFormatOptions,
                                       wkt: {
                                           ...userPlacesFormatOptions.wkt,
                                           ...options
                                       }
                                   });
    }

    let format: Format;
    let formatOptionsEditor;
    if (_userPlacesFormatName === 'csv') {
        format = csvFormat;
        formatOptionsEditor = (
                <CsvOptionsEditor
                        options={_userPlacesFormatOptions.csv}
                        updateOptions={updateCsvOptions}
                        className={classes.actionBox}
                />
        );
    } else if (_userPlacesFormatName === 'geojson') {
        format = geoJsonFormat;
        formatOptionsEditor = (
                <GeoJsonOptionsEditor
                        options={_userPlacesFormatOptions.geojson}
                        updateOptions={updateGeoJsonOptions}
                        className={classes.actionBox}
                />
        );
    } else  {
        format = wktFormat;
        formatOptionsEditor = (
                <WktOptionsEditor
                        options={_userPlacesFormatOptions.wkt}
                        updateOptions={updateWktOptions}
                        className={classes.actionBox}
                />
        );
    }

    return (
            <Dialog
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="server-dialog-title"
            >
                <DialogTitle id="server-dialog-title">{i18n.get('Add Places')}</DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                            row
                            value={_userPlacesFormatName}
                            onChange={e => handleFormatNameChange(e)}
                    >
                        <FormControlLabel
                                key={'csv'}
                                value={'csv'}
                                label={i18n.get(csvFormat.name)}
                                control={<Radio/>}
                        />
                        <FormControlLabel
                                key={'geojson'}
                                value={'geojson'}
                                label={i18n.get(geoJsonFormat.name)}
                                control={<Radio/>}
                        />
                        <FormControlLabel
                                key={'wkt'}
                                value={'wkt'}
                                label={i18n.get(wktFormat.name)}
                                control={<Radio/>}
                        />
                    </RadioGroup>
                    <CodeMirror
                            placeholder={'Enter text or drag & drop a text file.'}
                            autoFocus
                            height="400px"
                            extensions={[json()]}
                            value={userPlacesText}
                            onChange={handleTextAreaChange}
                            theme={Config.instance.branding.themeName || 'light'}
                            onDrop={handleDropFile}
                    />
                    {error && <Typography color="error" className={classes.error}>{error}</Typography>}
                    <div className={classes.actionBox}>
                        <FileUpload
                                title={i18n.get('From File') + '...'}
                                accept={format.fileExt}
                                multiple={false}
                                onSelect={handleFileSelect}
                                disabled={loading}
                                className={classes.actionButton}
                        />
                        <Button
                                onClick={handleClear}
                                disabled={userPlacesText.trim() === '' || loading}
                                className={classes.actionButton}
                                variant="outlined"
                                size="small"
                        >
                            {i18n.get('Clear')}
                        </Button>
                        <Box className={classes.spacer}/>
                        <IconButton onClick={() => setExpanded(!expanded)}>
                            {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </IconButton>
                    </div>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        {formatOptionsEditor}
                    </Collapse>
                </DialogContent>
                <DialogActions>
                    <Button
                            onClick={handleClose}
                            variant="text"
                    >
                        {i18n.get('Cancel')}
                    </Button>
                    <Button
                            onClick={handleConfirm}
                            disabled={userPlacesText.trim() === '' || error !== null || loading}
                            color="primary"
                            variant="text"
                    >
                        {i18n.get('OK')}
                    </Button>
                </DialogActions>
            </Dialog>
    );
}


export default UserPlacesDialog;
