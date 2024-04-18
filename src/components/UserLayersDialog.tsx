/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

import React from "react";
import Paper from "@mui/material/Paper";
import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { darken, lighten } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Close";
import CopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

import i18n from "@/i18n";
import { newId } from "@/util/id";
import { UserLayer, ControlState } from "@/states/controlState";
import UserLayerEditor from "@/components/UserLayerEditor";

const testLayers: UserLayer[] = [
  { id: "pipapo1", name: "Pipapo 1", url: "https://pipapo1.maps.co.uk" },
  { id: "pipapo2", name: "Pipapo 2", url: "https://pipapo2.maps.co.uk" },
  { id: "pipapo3", name: "Pipapo 3", url: "https://pipapo3.maps.co.uk" },
];

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: (theme.palette.mode === "dark" ? lighten : darken)(
      theme.palette.background.paper,
      0.1,
    ),
    marginBottom: theme.spacing(2),
  },
}));

interface EditedLayer {
  editId: string;
  editMode: "add" | "edit";
}

interface UserLayersDialogProps {
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
}

const UserLayersDialog: React.FC<UserLayersDialogProps> = ({
  open,
  closeDialog,
  // settings,
  // updateSettings,
}) => {
  const [userLayers, setUserLayers] = React.useState<UserLayer[]>([
    ...testLayers,
  ]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [editedLayer, setEditedLayer] = React.useState<EditedLayer | null>(
    null,
  );

  const classes = useStyles();

  if (!open) {
    return null;
  }

  function handleCloseDialog() {
    closeDialog("userLayers");
  }

  const handleUserLayerEdit = (userLayer: UserLayer) => {
    setEditedLayer({ editId: userLayer.id, editMode: "edit" });
  };

  const handleUserLayerCopy = (userLayer: UserLayer) => {
    const index = userLayers.findIndex((layer) => layer.id === userLayer.id);
    setUserLayers([
      ...userLayers.slice(0, index + 1),
      {
        ...userLayer,
        id: newId("user-layer"),
        name: userLayer.name + " Copy",
      },
      ...userLayers.slice(index + 1),
    ]);
  };

  const handleUserLayerRemove = (userLayer: UserLayer) => {
    const index = userLayers.findIndex((layer) => layer.id === userLayer.id);
    if (selectedId === userLayer.id) {
      setSelectedId(null);
    }
    setUserLayers([
      ...userLayers.slice(0, index),
      ...userLayers.slice(index + 1),
    ]);
  };

  const handleUserLayerAdd = () => {
    const id = newId("user-layer-");
    setUserLayers([...userLayers, { id, name: "", url: "", attribution: "" }]);
    setEditedLayer({ editId: id, editMode: "add" });
  };

  const handleUserLayerChange = (userLayer: UserLayer) => {
    const index = userLayers.findIndex((layer) => layer.id === userLayer.id);
    if (selectedId === userLayer.id) {
      setSelectedId(null);
    }
    setUserLayers([
      ...userLayers.slice(0, index),
      userLayer,
      ...userLayers.slice(index + 1),
    ]);
    setEditedLayer(null);
  };

  const handleEditorCanceled = () => {
    if (editedLayer && editedLayer.editMode === "add") {
      const index = userLayers.findIndex(
        (layer) => layer.id === editedLayer.editId,
      );
      setUserLayers([
        ...userLayers.slice(0, index),
        ...userLayers.slice(index + 1),
      ]);
    }
    setEditedLayer(null);
  };

  const editing = editedLayer !== null;

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"sm"}
      onClose={handleCloseDialog}
      scroll="body"
    >
      <DialogTitle>{i18n.get("User Layers")}</DialogTitle>
      <DialogContent>
        <Paper className={classes.paper}>
          <List component="nav" dense>
            {userLayers.map((userLayer) => {
              const selected = selectedId === userLayer.id;
              if (editedLayer && editedLayer.editId === userLayer.id) {
                return (
                  <UserLayerEditor
                    userLayer={userLayer}
                    onChange={handleUserLayerChange}
                    onCancel={handleEditorCanceled}
                  />
                );
              }
              return (
                <ListItemButton
                  key={userLayer.id}
                  selected={selected}
                  onClick={() => setSelectedId(selected ? null : userLayer.id)}
                >
                  <ListItemText
                    primary={userLayer.name}
                    secondary={userLayer.url}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleUserLayerEdit(userLayer)}
                      size="small"
                      disabled={editing}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUserLayerCopy(userLayer)}
                      size="small"
                      disabled={editing}
                    >
                      <CopyIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUserLayerRemove(userLayer)}
                      size="small"
                      disabled={editing}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              );
            })}
            {!editing && (
              <ListItem sx={{ minHeight: "3em" }}>
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={handleUserLayerAdd}
                    size="small"
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default UserLayersDialog;
