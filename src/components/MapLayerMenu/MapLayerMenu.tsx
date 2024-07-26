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

import { useState } from "react";
import Draggable, {
  ControlPosition,
  DraggableData,
  DraggableEvent,
} from "react-draggable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { LayerVisibilities } from "@/states/controlState";
import SelectableMenuItem from "@/components/SelectableMenuItem";
import MapLayerMenuItem from "./MapLayerMenuItem";

const initialPos: ControlPosition = { x: 10, y: 180 };

const styles = makeStyles({
  windowPaper: {
    position: "absolute",
    zIndex: 1000,
  },
  windowHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "move",
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
  },
  windowTitle: {
    fontWeight: "bolder",
  },
});

interface LayerMenuProps extends WithLocale {
  layerMenuOpen: boolean;
  setLayerMenuOpen: (layerMenuOpen: boolean) => void;
  openDialog: (dialogId: string) => void;
  layerTitles: Record<keyof LayerVisibilities, string>;
  layerSubtitles: Record<keyof LayerVisibilities, string>;
  layerDisablements: Record<keyof LayerVisibilities, boolean>;
  layerVisibilities: LayerVisibilities;
  setLayerVisibility: (
    layerId: keyof LayerVisibilities,
    visible: boolean,
  ) => void;
  variableCompareMode: boolean;
  setVariableCompareMode: (selected: boolean) => void;
  mapPointInfoBoxEnabled: boolean;
  setMapPointInfoBoxEnabled: (showPointInfoBox: boolean) => void;
}

export default function MapLayerMenu(props: LayerMenuProps) {
  const [position, setPosition] = useState<ControlPosition>(initialPos);

  const {
    layerMenuOpen,
    setLayerMenuOpen,
    openDialog,
    variableCompareMode,
    setVariableCompareMode,
    mapPointInfoBoxEnabled,
    setMapPointInfoBoxEnabled,
    ...layerSelectProps
  } = props;

  const handleUserOverlays = () => {
    openDialog("userOverlays");
  };

  const handleUserBaseMaps = () => {
    openDialog("userBaseMaps");
  };

  const handleCloseLayerMenu = () => {
    setLayerMenuOpen(false);
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setPosition({ ...data });
  };

  if (!layerMenuOpen) {
    return null;
  }

  return (
    <Draggable
      handle="#layer-select-header"
      position={position}
      onStop={handleDragStop}
    >
      <Paper elevation={10} sx={styles.windowPaper}>
        <Box id="layer-select-header" sx={styles.windowHeader}>
          <Box component="span" sx={styles.windowTitle}>
            {i18n.get("Layers")}
          </Box>
          <IconButton size="small" onClick={handleCloseLayerMenu}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <MenuList dense>
          <Divider />
          <MapLayerMenuItem layerId="baseMap" {...layerSelectProps} />
          <MapLayerMenuItem layerId="datasetRgb2" {...layerSelectProps} />
          <MapLayerMenuItem layerId="datasetRgb" {...layerSelectProps} />
          <MapLayerMenuItem layerId="datasetVariable2" {...layerSelectProps} />
          <MapLayerMenuItem layerId="datasetVariable" {...layerSelectProps} />
          <MapLayerMenuItem layerId="datasetBoundary" {...layerSelectProps} />
          <MapLayerMenuItem layerId="datasetPlaces" {...layerSelectProps} />
          <MapLayerMenuItem layerId="userPlaces" {...layerSelectProps} />
          <MapLayerMenuItem layerId="overlay" {...layerSelectProps} />
          <Divider />
          <SelectableMenuItem
            title={i18n.get("Compare Mode (Drag)")}
            selected={variableCompareMode}
            onClick={() => setVariableCompareMode(!variableCompareMode)}
          />
          <SelectableMenuItem
            title={i18n.get("Point Info Mode (Hover)")}
            selected={mapPointInfoBoxEnabled}
            onClick={() => setMapPointInfoBoxEnabled(!mapPointInfoBoxEnabled)}
          />
          <Divider />
          <MenuItem onClick={handleUserBaseMaps}>
            {i18n.get("User Base Maps") + "..."}
          </MenuItem>
          <MenuItem onClick={handleUserOverlays}>
            {i18n.get("User Overlays") + "..."}
          </MenuItem>
        </MenuList>
      </Paper>
    </Draggable>
  );
}
