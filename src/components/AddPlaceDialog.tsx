import * as React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import makeStyles from '@material-ui/core/styles/makeStyles';


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

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            aria-labelledby="server-dialog-title"
        >
            <DialogTitle id="server-dialog-title">{I18N.get('Add Place')}</DialogTitle>
            <DialogContent dividers>
                <Typography>{I18N.get('Enter (e.g. copy and paste) any valid GeoJSON or Geometry WKT here.')}</Typography>
                <TextareaAutosize
                    autoFocus
                    rows={16}
                    className={classes.textArea}
                    value={geometryText}
                    onChange={handleTextAreaChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{I18N.get('Cancel')}</Button>
                <Button onClick={handleConfirm} color="primary">{I18N.get('OK')}</Button>
            </DialogActions>
        </Dialog>
    );
}
