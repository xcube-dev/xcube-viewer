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

import { Theme } from '@mui/material';
import { WithStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import i18n from '../i18n';
import { ApiServerConfig } from '../model/apiServer';
import { newId } from '../util/id';

import { WithLocale } from '../util/lang';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        textField2: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 400,
        },
        button: {
            margin: 0.1 * theme.spacing(1),
        },
    });


interface ServerDialogProps extends WithStyles<typeof styles>, WithLocale {
    open: boolean;
    servers: ApiServerConfig[];
    selectedServer: ApiServerConfig;
    configureServers: (servers: ApiServerConfig[], selectedServerId: string) => void;
    closeDialog: (dialogId: string) => void;
}

const ServerDialog: React.FC<ServerDialogProps> = ({classes, open, servers, selectedServer, closeDialog, configureServers}) => {
    const ref = useRef(false);
    const [servers_, setServers_] = useState(servers);
    const [selectedServer_, setSelectedServer_] = useState(selectedServer);
    const [dialogMode, setDialogMode] = useState('select');

    useEffect(() => {
        if (ref.current) {
            setServers_(servers);
            setSelectedServer_(selectedServer);
        }
        ref.current = true;
    }, [servers, selectedServer]);

    const handleConfirm = () => {
        if (dialogMode === 'select') {
            closeDialog('server');
            configureServers(servers_, selectedServer_.id);
        } else if (dialogMode === 'add') {
            doAddServer();
        } else if (dialogMode === 'edit') {
            doEditServer();
        }
    };

    const handleCancel = () => {
        if (dialogMode === 'select') {
            doClose();
        } else {
            cancelAddOrEditMode();
        }
    };

    const handleClose = () => {
        doClose();
    };

    const handleSelectServer = (event: React.ChangeEvent<{ name?: string; value: any; }>) => {
        const selectedServerId = event.target.value;
        const selectedServer = servers_.find(server => server.id === selectedServerId)!;
        setSelectedServer_(selectedServer);
    };

    const handleServerNameChange = (event: any) => {
        const selectedServerName = event.target.value;
        const selectedServer = {...selectedServer_, name: selectedServerName};
        setSelectedServer_(selectedServer);
    };

    const handleServerURLChange = (event: any) => {
        const selectedServerURL = event.target.value;
        const selectedServer = {...selectedServer_, url: selectedServerURL};
        setSelectedServer_(selectedServer);
    };

    const handleAddMode = () => {
        setDialogMode('add');
    };

    const handleEditMode = () => {
        setDialogMode('edit');
    };

    const handleRemoveServer = () => {
        doRemoveServer();
    };

    const doClose = () => {
        closeDialog('server');
    };

    const getSelectedServerIndex = (): number => {
        const selectedServerId = selectedServer_.id;
        return servers_.findIndex(server => server.id === selectedServerId)!;
    };

    const setSelectedServer = (selectedServerIndex: number, selectedServer: ApiServerConfig) => {
        const servers = [...servers_];
        servers[selectedServerIndex] = selectedServer;
        setServers_(servers);
        setSelectedServer_(selectedServer);
        setDialogMode('select');
    };

    const setServers = (servers: ApiServerConfig[], selectedServer: ApiServerConfig) => {
        setServers_(servers);
        setSelectedServer_(selectedServer);
        setDialogMode('select');
    };

    const doAddServer = () => {
        const selectedServer = {...selectedServer_, id: newId()};
        const servers = [...servers_, selectedServer];
        setServers(servers, selectedServer);
    };

    const doEditServer = () => {
        setSelectedServer(getSelectedServerIndex(), {...selectedServer_});
    };

    const cancelAddOrEditMode = () => {
        const selectedServerIndex = getSelectedServerIndex();
        setSelectedServer(getSelectedServerIndex(), servers_[selectedServerIndex]);
    };

    const doRemoveServer = () => {
        const servers = [...servers_];
        if (servers.length < 2) {
            throw new Error('internal error: server list cannot be emptied');
        }
        const selectedServerIndex = getSelectedServerIndex();
        const selectedServer = servers[selectedServerIndex + (selectedServerIndex > 0 ? -1 : 1)];
        servers.splice(selectedServerIndex, 1);
        setServers(servers, selectedServer);
    };

    const menuItems = servers_.map((server, index) => (
        <MenuItem key={index} value={server.id}>{server.name}</MenuItem>
    ));

    let okButtonName;
    if (dialogMode === 'add') {
        okButtonName = i18n.get('Add');
    } else if (dialogMode === 'edit') {
        okButtonName = i18n.get('Save');
    } else {
        okButtonName = i18n.get('OK');
    }

    let dialogTitle;
    if (dialogMode === 'add') {
        dialogTitle = i18n.get('Add Server');
    } else if (dialogMode === 'edit') {
        dialogTitle = i18n.get('Edit Server');
    } else {
        dialogTitle = i18n.get('Select Server');
    }

    let dialogContent;
    if (dialogMode === 'add' || dialogMode === 'edit') {
        dialogContent = (
            <DialogContent dividers>
                <TextField
                    variant="standard"
                    required
                    id="server-name"
                    label="Name"
                    className={classes.textField}
                    margin="normal"
                    value={selectedServer_.name}
                    onChange={handleServerNameChange} />
                <br/>
                <TextField
                    variant="standard"
                    required
                    id="server-url"
                    label="URL"
                    className={classes.textField2}
                    margin="normal"
                    value={selectedServer_.url}
                    onChange={handleServerURLChange} />
            </DialogContent>
        );
    } else {
        dialogContent = (
            <DialogContent dividers>
                <div>
                    <FormControl variant="standard" className={classes.formControl}>
                        <InputLabel htmlFor="server-name">Name</InputLabel>
                        <Select
                            variant="standard"
                            value={selectedServer_.id}
                            onChange={handleSelectServer}
                            inputProps={{
                                name: 'server-name',
                                id: 'server-name',
                            }}>
                            {menuItems}
                        </Select>
                        <FormHelperText>{selectedServer_.url}</FormHelperText>
                    </FormControl>
                    <IconButton
                        className={classes.button}
                        aria-label="Add"
                        color="primary"
                        onClick={handleAddMode}
                        size="large">
                        <AddIcon fontSize="small"/>
                    </IconButton>
                    <IconButton
                        className={classes.button}
                        aria-label="Edit"
                        onClick={handleEditMode}
                        size="large">
                        <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton
                        className={classes.button}
                        aria-label="Delete"
                        disabled={servers_.length < 2}
                        onClick={handleRemoveServer}
                        size="large">
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </div>
            </DialogContent>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="server-dialog-title"
        >
            <DialogTitle id="server-dialog-title">{dialogTitle}</DialogTitle>
            {dialogContent}
            <DialogActions>
                <Button onClick={handleCancel}>{i18n.get('Cancel')}</Button>
                <Button onClick={handleConfirm} autoFocus color="primary">{okButtonName}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(ServerDialog);
