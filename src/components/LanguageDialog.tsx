import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Theme, WithStyles } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";

import { WithLocale } from "../util/lang";
import { I18N } from "../config";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        localeAvatar: {
            margin: 10,
        },
    });

interface LanguageDialogProps extends WithStyles<typeof styles>, WithLocale {
    open: boolean;
    changeLocale: (locale: string) => void;
    closeDialog: (dialogId: string) => void;
}

class LanguageDialog extends React.Component<LanguageDialogProps> {
    handleClose = () => {
        this.props.closeDialog("language");
    };

    handleLanguageSelect = (locale: string) => {
        this.props.closeDialog("language");
        this.props.changeLocale(locale);
    };

    render() {
        const {classes, open, locale} = this.props;

        const listItems = Object.getOwnPropertyNames(I18N.languages).map(langLocale => {
            const langName = I18N.languages[langLocale];
            return (
                <ListItem
                    button
                    key={langLocale}
                    selected={langLocale === locale}
                    onClick={() => this.handleLanguageSelect(langLocale)}
                >
                    <ListItemAvatar>
                        <Avatar className={classes.localeAvatar}>{langLocale}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={langName}/>
                </ListItem>
            );
        });

        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                aria-labelledby="language-dialog-title"
            >
                <DialogTitle id="language-dialog-title">{I18N.get("Language")}</DialogTitle>
                <div>
                    <List>{listItems}</List>
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles)(LanguageDialog);
