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
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { WithLocale } from '../util/lang';
import i18n from '../i18n';


// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles(theme => (
    {
        textArea: {
            width: '100%',
            backgroundColor: (theme.palette.type === 'dark' ? lighten : darken)(theme.palette.background.paper, 0.78),
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

    const handleTextAreaChange = (event: any) => {
        setGeometryText(event.target.value);
    };

    const isGeometryTextValid = (): boolean => {
        return geometryText.trim() !== "";
    };

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            aria-labelledby="server-dialog-title"
        >
            <DialogTitle id="server-dialog-title">{i18n.get('Add Place')}</DialogTitle>
            <DialogContent dividers>
                <Typography>{i18n.get('Enter (e.g. copy and paste) any valid GeoJSON here.')}</Typography>
                <TextareaAutosize
                    autoFocus
                    rows={16}
                    className={classes.textArea}
                    value={geometryText}
                    onChange={handleTextAreaChange}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    {i18n.get('Cancel')}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!isGeometryTextValid()}
                    color="primary"
                >
                    {i18n.get('OK')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
