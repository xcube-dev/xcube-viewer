/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import i18n from "@/i18n";
import { LayerDefinition } from "@/model/layerDefinition";
import { ControlState } from "@/states/controlState";
import UserLayersPanel from "./UserLayersPanel";

interface UserLayersDialogProps {
  dialogId: "userOverlays" | "userBaseMaps";
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
}

const UserLayersDialog: React.FC<UserLayersDialogProps> = ({
  dialogId,
  open,
  closeDialog,
  settings,
  updateSettings,
}) => {
  const [tabIndex, setTabIndex] = React.useState(
    dialogId === "userBaseMaps" ? 0 : 1,
  );

  if (!open) {
    return null;
  }

  const baseMaps = settings.userBaseMaps;
  const setBaseMaps = (userBaseMaps: LayerDefinition[]) => {
    updateSettings({ userBaseMaps });
  };

  const overlays = settings.userOverlays;
  const setOverlays = (userOverlays: LayerDefinition[]) => {
    updateSettings({ userOverlays });
  };

  const selectedBaseMapId = settings.selectedBaseMapId;
  const setSelectedBaseMapId = (selectedBaseMapId: string | null) => {
    updateSettings({ selectedBaseMapId });
  };

  const selectedOverlayId = settings.selectedOverlayId;
  const setSelectedOverlayId = (selectedOverlayId: string | null) => {
    updateSettings({ selectedOverlayId });
  };

  function handleCloseDialog() {
    closeDialog(dialogId);
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
            <Tab label="Base Maps" />
            <Tab label="Overlays" />
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
