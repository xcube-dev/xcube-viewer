import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Theme, WithStyles } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

import { WithLocale } from "../util/lang";
import { I18N } from "../config";
import { Server } from "../model/server";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 200,
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 200,
        },
        textField2: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 400,
        },
        button: {
            margin: 0.1 * theme.spacing.unit,
        },
    });


interface ServerDialogState {
    servers: Server[];
    selectedServer: Server;
    dialogMode: "select" | "add" | "edit";
}

interface ServerDialogProps extends WithStyles<typeof styles>, WithLocale {
    open: boolean;
    servers: Server[];
    selectedServer: Server;
    configureServers: (servers: Server[], selectedServerId: string) => void;
    closeDialog: (dialogId: string) => void;
}

class ServerDialog extends React.Component<ServerDialogProps, ServerDialogState> {

    constructor(props: ServerDialogProps) {
        super(props);
        this.state = ServerDialog.deriveState(props);
    }

    static deriveState(props: ServerDialogProps): ServerDialogState {
        console.log("getDerivedStateFromProps: ", props);
        const {servers, selectedServer} = props;
        return {servers, selectedServer, dialogMode: "select"};
    }

    componentDidUpdate(prevProps: Readonly<ServerDialogProps>): void {
        console.log("componentDidUpdate: ", this.props, this.state);
        if (prevProps.servers !== this.props.servers
            || prevProps.selectedServer !== this.props.selectedServer) {
            this.setState(ServerDialog.deriveState(this.props));
        }
    }

    handleConfirm = () => {
        const {servers, selectedServer, dialogMode} = this.state;
        if (dialogMode === "select") {
            const {closeDialog, configureServers} = this.props;
            closeDialog("server");
            configureServers(servers, selectedServer.id);
        } else if (dialogMode === "add") {
            this.doAddServer();
        } else if (dialogMode === "edit") {
            this.doEditServer();
        }
    };

    handleCancel = () => {
        const {dialogMode} = this.state;
        if (dialogMode === "select") {
            this.doClose();
            this.setState(ServerDialog.deriveState(this.props))
        } else if (dialogMode === "add") {
            this.setState({dialogMode: "select"});
        } else if (dialogMode === "edit") {
            this.setState({dialogMode: "select"});
        }
    };

    doClose = () => {
        const {closeDialog} = this.props;
        closeDialog("server");
    };

    handleSelectServer = (event: any) => {
        const selectedServerId = event.target.value;
        const selectedServer = this.state.servers.find(server => server.id === selectedServerId)!;
        this.setState({selectedServer});
    };

    handleServerNameChange = (event: any) => {
        const name = event.target.value;
        const selectedServer = {...this.state.selectedServer, name};
        this.setState({selectedServer});
    };

    handleServerURLChange = (event: any) => {
        const url = event.target.value;
        const selectedServer = {...this.state.selectedServer, url};
        this.setState({selectedServer});
    };

    handleAddMode = () => {
        this.setState({dialogMode: "add"});
    };

    handleEditMode = () => {
        this.setState({dialogMode: "edit"});
    };

    doAddServer = () => {
        const selectedServerId = (Date.now().toString(16) + Math.random().toString(16).substr(2)).toUpperCase();
        const selectedServer = {...this.state.selectedServer, id: selectedServerId};
        const servers = [...this.state.servers, selectedServer];
        this.setState({servers, selectedServer, dialogMode: "select"});
    };

    doEditServer = () => {
        const selectedServerId = this.state.selectedServer.id;
        const selectedServerIndex = this.state.servers.findIndex(server => server.id === selectedServerId)!;
        const selectedServer = {...this.state.selectedServer};
        const servers = [
            ...this.state.servers.slice(0, selectedServerIndex),
            selectedServer,
            ...this.state.servers.slice(selectedServerIndex + 1),
        ];
        this.setState({servers, selectedServer, dialogMode: "select"});
    };

    handleRemoveServer = () => {
        const servers = [...this.state.servers];
        if (servers.length < 2) {
            throw new Error("internal error: server list cannot be emptied");
        }
        const selectedServerId = this.state.selectedServer.id;
        const selectedServerIndex = servers.findIndex(server => server.id === selectedServerId)!;
        const selectedServer = servers[selectedServerIndex + (selectedServerIndex > 0 ? -1 : 1)];
        servers.splice(selectedServerIndex, 1);
        this.setState({servers, selectedServer});
    };

    render() {
        const {classes, open} = this.props;
        const {servers, selectedServer, dialogMode} = this.state;

        const menuItems = servers.map((server, index) => (
            <MenuItem key={index} value={server.id}>{server.name}</MenuItem>));

        let okButtonName;
        if (dialogMode === "add") {
            okButtonName = I18N.get("Add");
        } else if (dialogMode === "edit") {
            okButtonName = I18N.get("Save");
        } else {
            okButtonName = I18N.get("Select");
        }

        let dialogTitle;
        if (dialogMode === "add") {
            dialogTitle = I18N.get("Add Server");
        } else if (dialogMode === "edit") {
            dialogTitle = I18N.get("Edit Server");
        } else {
            dialogTitle = I18N.get("Select Server");
        }

        let dialogContent;
        if (dialogMode === "add" || dialogMode === "edit") {
            dialogContent = (
                <DialogContent>
                    <TextField
                        required
                        id="server-name"
                        label="Name"
                        defaultValue="My Server"
                        className={classes.textField}
                        margin="normal"
                        value={selectedServer.name}
                        onChange={this.handleServerNameChange}
                    />
                    <br/>
                    <TextField
                        required
                        id="server-url"
                        label="URL"
                        defaultValue="Hello World"
                        className={classes.textField2}
                        margin="normal"
                        value={selectedServer.url}
                        onChange={this.handleServerURLChange}
                    />
                </DialogContent>
            );
        } else {
            dialogContent = (
                <DialogContent>
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="server-name">Name</InputLabel>
                            <Select
                                value={selectedServer.id}
                                onChange={this.handleSelectServer}
                                inputProps={{
                                    name: 'server-name',
                                    id: 'server-name',
                                }}>
                                {menuItems}
                            </Select>
                            <FormHelperText>{selectedServer.url}</FormHelperText>
                        </FormControl>
                        <IconButton
                            className={classes.button}
                            aria-label="Add"
                            color="primary"
                            onClick={this.handleAddMode}
                        >
                            <AddIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            color="primary"
                            onClick={this.handleEditMode}
                        >
                            <EditIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            className={classes.button}
                            aria-label="Delete"
                            color="primary"
                            disabled={servers.length < 2}
                            onClick={this.handleRemoveServer}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </div>
                </DialogContent>
            );
        }

        return (
            <Dialog
                open={open}
                onClose={this.doClose}
                aria-labelledby="server-dialog-title"
            >
                <DialogTitle id="server-dialog-title">{dialogTitle}</DialogTitle>
                {dialogContent}
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary" autoFocus>{I18N.get("Cancel")}</Button>
                    <Button onClick={this.handleConfirm} color="primary">{okButtonName}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(ServerDialog);
