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
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import i18n from "@/i18n";
import { UserLayer, ControlState } from "@/states/controlState";
import UserLayersPanel from "./UserLayersPanel";

const testLayers: UserLayer[] = [
  { id: "pipapo1", name: "Pipapo 1", url: "https://pipapo1.maps.co.uk" },
  { id: "pipapo2", name: "Pipapo 2", url: "https://pipapo2.maps.co.uk" },
  { id: "pipapo3", name: "Pipapo 3", url: "https://pipapo3.maps.co.uk" },
];

interface UserLayersDialogProps {
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
  dialogId: "userOverlays" | "userBaseMaps";
}

const UserLayersDialog: React.FC<UserLayersDialogProps> = ({
  open,
  closeDialog,
  dialogId,
  // settings,
  // updateSettings,
}) => {
  const [baseMaps, setBaseMaps] = React.useState<UserLayer[]>([...testLayers]);
  const [selectedBaseMapId, setSelectedBaseMapId] = React.useState<
    string | null
  >(null);
  const [overlays, setOverlays] = React.useState<UserLayer[]>([...testLayers]);
  const [selectedOverlayId, setSelectedOverlayId] = React.useState<
    string | null
  >(null);
  const [tabIndex, setTabIndex] = React.useState(
    dialogId === "userBaseMaps" ? 0 : 1,
  );

  if (!open) {
    return null;
  }

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
            userLayers={baseMaps}
            setUserLayers={setBaseMaps}
            selectedId={selectedBaseMapId}
            setSelectedId={setSelectedBaseMapId}
          />
        )}
        {tabIndex === 1 && (
          <UserLayersPanel
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
