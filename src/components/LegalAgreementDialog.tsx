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

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import i18n from '../i18n';
import { ControlState } from '../states/controlState';


const useStyles = makeStyles(theme => ({
        icon: {
            marginRight: theme.spacing(2),
        },
    }
));

interface LegalAgreementDialogProps {
    open: boolean;

    settings: ControlState;
    updateSettings: (settings: ControlState) => void;
}

export default function LegalAgreementDialog({open, settings, updateSettings}: LegalAgreementDialogProps) {
    const classes = useStyles();

    if (!open) {
        return null;
    }

    function handleConfirm() {
        updateSettings({...settings, legalAgreementAccepted: true});
    }

    return (
        <Dialog
            open={open}
            disableEscapeKeyDown={true}
            onClose={handleConfirm}
            scroll='body'>
            <DialogTitle>{i18n.get('Legal Agreement')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {i18n.get('We use „HTML5 local storage” to save and restore your settings. 3rd parties will never see your data. Note we do not use „cookies” at all.')}
                </DialogContentText>
                <DialogContentText>
                    {i18n.get('Find out more')}{' '}
                    <Link
                        href={i18n.get("https://en.wikipedia.org/wiki/Web_storage")}
                        target='_blank'
                        rel='noreferrer'
                    >
                        {i18n.get('here')}
                    </Link>.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleConfirm} color="primary">
                    <CheckIcon className={classes.icon}/>
                    {i18n.get('Accept and continue')}
                </Button>
            </DialogActions>

        </Dialog>
    );
}

