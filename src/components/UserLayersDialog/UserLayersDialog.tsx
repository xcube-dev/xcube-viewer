/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useCallback, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import i18n from "@/i18n";
import { LayerDefinition } from "@/model/layerDefinition";
import { ControlState, LayerVisibilities } from "@/states/controlState";
import UserLayersPanel from "./UserLayersPanel";

interface UserLayersDialogProps {
  dialogId: "userOverlays" | "userBaseMaps";
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
  setLayerVisibilities: (layerVisibilities: LayerVisibilities) => void;
}

const UserLayersDialog: React.FC<UserLayersDialogProps> = ({
  dialogId,
  open,
  closeDialog,
  settings,
  updateSettings,
  setLayerVisibilities,
}) => {
  const [selectedBaseMapId, _setSelectedBaseMapId] = useState<string | null>(
    null,
  );
  const [selectedOverlayId, _setSelectedOverlayId] = useState<string | null>(
    null,
  );

  const _setLayerVisibilities = useCallback(
    (oldLayerId: string | null, newLayerId: string | null) => {
      const visibilities: LayerVisibilities = {};
      if (oldLayerId) {
        visibilities[oldLayerId] = false;
      }
      if (newLayerId) {
        visibilities[newLayerId] = true;
      }
      setLayerVisibilities(visibilities);
    },
    [setLayerVisibilities],
  );

  const setSelectedBaseMapId = useCallback(
    (layerId: string | null) => {
      _setSelectedBaseMapId(layerId);
      _setLayerVisibilities(selectedBaseMapId, layerId);
    },
    [selectedBaseMapId, _setLayerVisibilities],
  );

  const setSelectedOverlayId = useCallback(
    (layerId: string | null) => {
      _setSelectedOverlayId(layerId);
      _setLayerVisibilities(selectedBaseMapId, layerId);
    },
    [selectedBaseMapId, _setLayerVisibilities],
  );

  const [tabIndex, setTabIndex] = useState(dialogId === "userBaseMaps" ? 0 : 1);

  const baseMaps = settings.userBaseMaps;
  const setBaseMaps = useCallback(
    (userBaseMaps: LayerDefinition[]) => {
      updateSettings({ userBaseMaps });
    },
    [updateSettings],
  );

  const overlays = settings.userOverlays;
  const setOverlays = useCallback(
    (userOverlays: LayerDefinition[]) => {
      updateSettings({ userOverlays });
    },
    [updateSettings],
  );

  function handleCloseDialog() {
    closeDialog(dialogId);
  }

  if (!open) {
    return null;
  }

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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabIndex} onChange={(_, index) => setTabIndex(index)}>
            <Tab label={i18n.get("Base Maps")} />
            <Tab label={i18n.get("Overlays")} />
          </Tabs>
        </Box>
        {tabIndex === 0 && (
          <UserLayersPanel
            key="baseMaps"
            userLayers={baseMaps}
            setUserLayers={setBaseMaps}
            selectedId={selectedBaseMapId}
            setSelectedId={setSelectedBaseMapId}
          />
        )}
        {tabIndex === 1 && (
          <UserLayersPanel
            key="overlays"
            userLayers={overlays}
            setUserLayers={setOverlays}
            selectedId={selectedOverlayId}
            setSelectedId={setSelectedOverlayId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserLayersDialog;
