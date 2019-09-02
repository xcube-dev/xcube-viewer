import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import CheckIcon from '@material-ui/icons/Check';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { I18N } from '../config';
import { ControlState } from '../states/controlState';
import Link from '@material-ui/core/Link';


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
            disableBackdropClick={true}
            onClose={handleConfirm}
            scroll='body'
        >
            <DialogTitle>{I18N.get('Legal Agreement')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {I18N.get('We use „HTML5 local storage” to save and restore your settings. 3rd parties will never see your data. Note we not use „cookies” at all.')}
                </DialogContentText>
                <DialogContentText>
                    {I18N.get('Find out more')}{' '}
                    <Link href={I18N.get("https://en.wikipedia.org/wiki/Web_storage")} target='_blank'>{I18N.get('here')}</Link>.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleConfirm} color="primary">
                    <CheckIcon className={classes.icon}/>
                    {I18N.get('Accept and continue')}
                </Button>
            </DialogActions>

        </Dialog>
    );
}

