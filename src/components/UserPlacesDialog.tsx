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
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from "@material-ui/core/Box";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

import { WithLocale } from '../util/lang';
import i18n from '../i18n';
import { Config } from "../config";
import { FileUpload } from "./FileUpload";
import { ControlState } from "../states/controlState";


// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles(theme => (
    {
        spacer: {
            flexGrow: 1.0,
        },
        placeLabelPropertyName: {
            marginRight: theme.spacing(1),
            flexGrow: 1.0
        },
        placeLabelPrefix: {
            flexGrow: 1.0
        },
        actionBox: {
            paddingTop: theme.spacing(0.5),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        actionButton: {
            marginRight: theme.spacing(1),
        },
        error: {
            fontSize: "small"
        }
    }
));


interface UserPlacesDialogProps extends WithLocale {
    open: boolean;
    closeDialog: (dialogId: string) => void;
    placeLabelPropertyName: string;
    placeLabelPrefix: string;
    updateSettings: (settings: ControlState) => void;
    addUserPlacesFromText: (userPlacesText: string) => void;
}

const UserPlacesDialog: React.FC<UserPlacesDialogProps> = (
    {
        open,
        placeLabelPropertyName,
        placeLabelPrefix,
        closeDialog,
        updateSettings,
        addUserPlacesFromText
    }) => {

    const [userPlacesText, setUserPlacesText] = React.useState('');
    const [error, setError] = React.useState<string | null>(getError(userPlacesText));
    const [loading, setLoading] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [_placeLabelPropertyName, setPlaceLabelPropertyName] = React.useState(placeLabelPropertyName);
    const [_placeLabelPrefix, setPlaceLabelPrefix] = React.useState(placeLabelPrefix);
    const classes = useStyles();

    React.useEffect(() => {
        setPlaceLabelPropertyName(placeLabelPropertyName);
        setPlaceLabelPrefix(placeLabelPrefix);
    }, [placeLabelPropertyName, placeLabelPrefix]);

    if (!open) {
        return null;
    }

    const handleConfirm = () => {
        closeDialog('addUserPlacesFromText');
        updateSettings({
            placeLabelPropertyName: _placeLabelPropertyName,
            placeLabelPrefix: _placeLabelPrefix,
        });
        addUserPlacesFromText(userPlacesText);
    };

    const handleClose = () => {
        closeDialog('addUserPlacesFromText');
    };

    const handleClear = () => {
        setUserPlacesText("");
    };

    const handleFileSelect = (selection: File[]) => {
        const file = selection[0];
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserPlacesText(reader.result as string);
            setLoading(false);
        };
        reader.onabort = reader.onerror = () => {
            setLoading(false);
        };
        reader.readAsText(file, "UTF-8");
    };

    const handleDropFile = () => {
        setUserPlacesText("");
    }

    const handleTextAreaChange = (value: string) => {
        setUserPlacesText(value);
        setError(getError(value));
    };

    // TODO: in addition to GeoJSON, also allow for WKT too

    function handleLabelPropertyNameChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setPlaceLabelPropertyName(e.target.value);
    }

    function handleFallbackNamePrefixChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setPlaceLabelPrefix(e.target.value);
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
                <Typography>{i18n.get('Enter GeoJSON or drag & drop a GeoJSON file.')}</Typography>
                <CodeMirror
                    autoFocus
                    height="400px"
                    extensions={[json()]}
                    value={userPlacesText}
                    onChange={handleTextAreaChange}
                    theme={Config.instance.branding.themeName || "light"}
                    onDrop={handleDropFile}
                />
                {error && <Typography color="error" className={classes.error}>{error}</Typography>}
                <div className={classes.actionBox}>
                    <FileUpload
                        title={i18n.get('From File') + "..."}
                        accept=".json,.geojson"
                        multiple={false}
                        onSelect={handleFileSelect}
                        disabled={loading}
                        className={classes.actionButton}
                    />
                    <Button
                        onClick={handleClear}
                        disabled={userPlacesText.trim() === "" || loading}
                        className={classes.actionButton}
                        variant="outlined"
                        size="small"
                    >
                        {i18n.get('Clear')}
                    </Button>
                    <Box className={classes.spacer}/>
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLessIcon/>:<ExpandMoreIcon/>}
                    </IconButton>
                </div>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div className={classes.actionBox}>
                        <TextField
                            label={i18n.get("Label property name")}
                            value={_placeLabelPropertyName}
                            onChange={handleLabelPropertyNameChange}
                            size="small"
                            variant="standard"
                            className={classes.placeLabelPropertyName}
                        />
                        <TextField
                            label={i18n.get("Label prefix (used as fallback)")}
                            value={_placeLabelPrefix}
                            onChange={handleFallbackNamePrefixChange}
                            size="small"
                            variant="standard"
                            className={classes.placeLabelPrefix}
                        />
                    </div>
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
                    disabled={userPlacesText.trim() === "" || error !== null || loading}
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

const getError = (geometryText: string): string | null => {
    if (geometryText.trim() !== "") {
        try {
            JSON.parse(geometryText);
        } catch (e) {
            console.error(e);
            return `${e}`;
        }
    }
    return null;
};

