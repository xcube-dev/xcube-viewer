import * as React from 'react';
import classNames from 'classnames';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import { MessageLogEntry } from '../states/messageLogState';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { SnackbarOrigin } from '@material-ui/core/Snackbar/Snackbar';


const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


const styles = (theme: Theme) => createStyles(
    {
        close: {
            padding: theme.spacing(0.5),
        },
        success: {
            color: theme.palette.error.contrastText,
            backgroundColor: green[600],
        },
        error: {
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.error.dark,
        },
        info: {
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.primary.dark,
        },
        warning: {
            color: theme.palette.error.contrastText,
            backgroundColor: amber[700],
        },
        icon: {
            fontSize: 20,
        },
        iconVariant: {
            opacity: 0.9,
            marginRight: theme.spacing(1),
        },
        message: {
            display: 'flex',
            alignItems: 'center',
        },
    });

interface MessageLogProps extends WithStyles<typeof styles> {
    message: MessageLogEntry | null;
    hideMessage: (messageId: number) => void;
    className?: string;
}

const SNACKBAR_ANCHOR_ORIGIN: SnackbarOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
};

class MessageLog extends React.Component<MessageLogProps> {

    handleClose = (event: React.SyntheticEvent<any>, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.props.hideMessage(this.props.message!.id);
    };

    render() {
        const {classes, className, message} = this.props;

        if (!message) {
            return null;
        }

        const MessageIcon = variantIcon[message.type];

        return (
            <Snackbar
                open={true}
                anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
                onClose={this.handleClose}>
                <SnackbarContent
                    className={classNames(classes[message.type], className)}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            <MessageIcon className={classNames(classes.icon, classes.iconVariant)}/>
                            {message.text}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon className={classes.icon}/>
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    }
}

export default withStyles(styles)(MessageLog);