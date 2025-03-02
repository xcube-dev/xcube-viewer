/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Paper from "@mui/material/Paper";
import { darken, lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Close";
import CopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

import i18n from "@/i18n";
import { newId } from "@/util/id";
import { LayerDefinition, USER_GROUP_NAME } from "@/model/layerDefinition";
import UserLayerEditorWms from "./UserLayerEditorWms";
import UserLayerEditorXyz from "./UserLayerEditorXyz";
import useUndo from "@/hooks/useUndo";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  paper: (theme) => ({
    backgroundColor: (theme.palette.mode === "dark" ? lighten : darken)(
      theme.palette.background.paper,
      0.1,
    ),
    marginBottom: theme.spacing(2),
  }),
});

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
  const [undo, setUndo] = useUndo();

  if (!open) {
    return null;
  }

  const handleUserLayerEdit = (userLayer: LayerDefinition) => {
    setUndo(() => setUserLayers(userLayers));
    setEditedLayer({
      editId: userLayer.id,
      editMode: "edit",
    });
  };

  const handleUserLayerCopy = (userLayer: LayerDefinition) => {
    setUndo(undefined);
    const index = userLayers.findIndex((layer) => layer.id === userLayer.id);
    setUserLayers([
      ...userLayers.slice(0, index + 1),
      {
        ...userLayer,
        id: newId("user-layer"),
        title: userLayer.title + " Copy",
      },
      ...userLayers.slice(index + 1),
    ]);
  };

  const handleUserLayerRemove = (userLayer: LayerDefinition) => {
    setUndo(undefined);
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

  const addUserLayer = (layerType: "wms" | "xyz") => {
    setUndo(() => setUserLayers(userLayers));
    const id = newId("user-layer-");
    setUserLayers([
      ...userLayers,
      // TODO: I18N
      {
        id,
        group: USER_GROUP_NAME,
        title: "",
        url: "",
        attribution: "",
        wms: layerType === "wms" ? { layerName: "" } : undefined,
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

  const handleEditCommitted = (userLayer: LayerDefinition) => {
    setUndo(undefined);
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

  const handleEditCanceled = () => {
    undo();
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
    <Paper sx={styles.paper}>
      <List component="nav" dense>
        {userLayers.map((userLayer) => {
          const selected = selectedId === userLayer.id;
          if (editedLayer && editedLayer.editId === userLayer.id) {
            return userLayer.wms ? (
              <UserLayerEditorWms
                key={userLayer.id}
                userLayer={userLayer}
                onChange={handleEditCommitted}
                onCancel={handleEditCanceled}
              />
            ) : (
              <UserLayerEditorXyz
                key={userLayer.id}
                userLayer={userLayer}
                onChange={handleEditCommitted}
                onCancel={handleEditCanceled}
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
                primary={userLayer.title}
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
          <ListItem sx={{ minHeight: "2rem" }}>
            <ListItemSecondaryAction>
              <Box sx={{ display: "flex", gap: 2, paddingTop: 2 }}>
                <Tooltip title={i18n.get("Add layer from a Web Map Service")}>
                  <Button
                    onClick={handleAddUserLayerWms}
                    startIcon={<AddIcon />}
                  >
                    {"WMS"}
                  </Button>
                </Tooltip>
                <Tooltip title={i18n.get("Add layer from a Tiled Web Map")}>
                  <Button
                    onClick={handleAddUserLayerXyz}
                    startIcon={<AddIcon />}
                  >
                    {"XYZ"}
                  </Button>
                </Tooltip>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default UserLayersPanel;
