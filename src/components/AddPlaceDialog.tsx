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
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

import { WithLocale } from '../util/lang';
import i18n from '../i18n';
import { Config } from "../config";
import { FileUpload } from "./FileUpload";


// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles(theme => (
    {
        actionBox: {
            paddingTop: "8px"
        }
    }
));


interface AddPlaceDialogProps extends WithLocale {
    open: boolean;
    closeDialog: (dialogId: string) => void;
    addUserPlaceFromText: (geometryText: string) => void;
}

export default function AddPlaceDialog({open, closeDialog, addUserPlaceFromText}: AddPlaceDialogProps) {

    const [geometryText, setGeometryText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();

    if (!open) {
        return null;
    }

    const handleConfirm = () => {
        closeDialog('addUserPlaceFromText');
        addUserPlaceFromText(geometryText);
    };

    const handleClose = () => {
        closeDialog('addUserPlaceFromText');
    };

    const handleClean = () => {
        setGeometryText("");
    };

    const handleFileSelect = (selection: File[]) => {
        const file = selection[0];
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setGeometryText(reader.result as string);
            setLoading(false);
        };
        reader.onabort = reader.onerror = () => {
            setLoading(false);
        };
        reader.readAsText(file, "UTF-8");
    };

    const handleDropFile = () => {
        setGeometryText("");
    }

    const handleTextAreaChange = (value: string) => {
        setGeometryText(value);
    };

    const isGeometryTextEmpty = (): boolean => {
        return geometryText.trim() !== "";
    };

    const isGeometryTextValid = (): boolean => {
        return isGeometryTextEmpty();
    };

    // TODO: in addition to GeoJSON, also allow for WKT too

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            aria-labelledby="server-dialog-title"
        >
            <DialogTitle id="server-dialog-title">{i18n.get('Add Place')}</DialogTitle>
            <DialogContent dividers>
                <Typography>{i18n.get('Enter GeoJSON or drag & drop a GeoJSON file.')}</Typography>
                <CodeMirror
                    autoFocus
                    height="400px"
                    extensions={[json()]}
                    value={geometryText}
                    onChange={handleTextAreaChange}
                    theme={Config.instance.branding.themeName || "light"}
                    onDrop={handleDropFile}
                />
                <Box className={classes.actionBox}>
                    <FileUpload
                        title={i18n.get('From File') + "..."}
                        accept=".json,.geojson"
                        multiple={false}
                        onSelect={handleFileSelect}
                        disabled={loading}
                    />
                    <Button
                        onClick={handleClean}
                        disabled={!isGeometryTextEmpty() || loading}
                    >
                        {i18n.get('Clean')}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    {i18n.get('Cancel')}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!isGeometryTextValid() || loading}
                    color="primary"
                >
                    {i18n.get('OK')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

