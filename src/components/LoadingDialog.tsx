import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";


const styles = (theme: Theme) => createStyles(
    {
        progress: {
            margin: theme.spacing.unit * 2,
        },
        message: {
            margin: theme.spacing.unit,
            textAlign: "center"
        },
    });

interface LoadingDialogProps extends WithStyles<typeof styles> {
    messages: string[];
}

class LoadingDialog extends React.Component<LoadingDialogProps> {

    render() {
        const {classes, messages} = this.props;

        if (messages.length === 0) {
            return null;
        }

        // TODO: I18N me!
        return (
            <Dialog open={true} aria-labelledby="loading">
                <DialogTitle id="loading">Please wait...</DialogTitle>
                <div>
                    <CircularProgress className={classes.progress}/>
                    {messages.map((message, i) => (
                        <Typography component="div" key={i}
                                    className={classes.message}>{message}</Typography>
                    ))}
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(LoadingDialog);

