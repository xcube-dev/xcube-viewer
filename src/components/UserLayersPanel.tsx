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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { LayerDefinition } from "@/model/layerDefinition";
import UserLayerEditorWms from "./UserLayerEditorWms";
import UserLayerEditorXyz from "./UserLayerEditorXyz";

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

interface UserLayersPanelProps {
  userLayers: LayerDefinition[];
  setUserLayers: (userLayers: LayerDefinition[]) => void;
  selectedId: string | null;
  setSelectedId: (selectedId: string | null) => void;
}

const UserLayersPanel: React.FC<UserLayersPanelProps> = ({
  userLayers,
  setUserLayers,
  selectedId,
  setSelectedId,
}) => {
  const [selectedDefaultId, setSelectedDefaultId] = React.useState(selectedId);
  const [editedLayer, setEditedLayer] = React.useState<EditedLayer | null>(
    null,
  );

  const classes = useStyles();

  if (!open) {
    return null;
  }

  const handleUserLayerEdit = (userLayer: LayerDefinition) => {
    setEditedLayer({
      editId: userLayer.id,
      editMode: "edit",
    });
  };

  const handleUserLayerCopy = (userLayer: LayerDefinition) => {
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

  const handleUserLayerRemove = (userLayer: LayerDefinition) => {
    const index = userLayers.findIndex((layer) => layer.id === userLayer.id);
    if (userLayer.id === selectedId) {
      setSelectedId(selectedDefaultId);
    }
    if (userLayer.id === selectedDefaultId) {
      setSelectedDefaultId(null);
    }
    setUserLayers([
      ...userLayers.slice(0, index),
      ...userLayers.slice(index + 1),
    ]);
  };

  const addUserLayer = (layerType: "xyz" | "wms") => {
    const id = newId("user-layer-");
    setUserLayers([
      ...userLayers,
      // TODO: I18N
      {
        id,
        group: "User",
        name: "",
        url: "",
        attribution: "",
        wms: layerType === "wms" ? true : undefined,
      },
    ]);
    setEditedLayer({ editId: id, editMode: "add" });
  };

  const handleAddUserLayerWms = () => {
    addUserLayer("wms");
  };

  const handleAddUserLayerXyz = () => {
    addUserLayer("xyz");
  };

  const handleUserLayerChange = (userLayer: LayerDefinition) => {
    const index = userLayers.findIndex((layer) => layer.id === userLayer.id);
    if (selectedId === userLayer.id) {
      setSelectedId(selectedDefaultId);
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
    <Paper className={classes.paper}>
      <List component="nav" dense>
        {userLayers.map((userLayer) => {
          const selected = selectedId === userLayer.id;
          if (editedLayer && editedLayer.editId === userLayer.id) {
            return userLayer.wms ? (
              <UserLayerEditorWms
                userLayer={userLayer}
                onChange={handleUserLayerChange}
                onCancel={handleEditorCanceled}
              />
            ) : (
              <UserLayerEditorXyz
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
              <Box sx={{ display: "flex", gap: 2, paddingTop: 2 }}>
                <Button
                  onClick={handleAddUserLayerWms}
                  startIcon={<AddIcon />}
                  color="primary"
                >
                  {i18n.get("WMS")}
                </Button>
                <Button
                  onClick={handleAddUserLayerXyz}
                  startIcon={<AddIcon />}
                  color="primary"
                >
                  {i18n.get("XYZ")}
                </Button>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default UserLayersPanel;
