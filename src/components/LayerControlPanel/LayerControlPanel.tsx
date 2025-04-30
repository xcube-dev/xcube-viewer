/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, SyntheticEvent, useState } from "react";
import Draggable, {
  ControlPosition,
  DraggableData,
  DraggableEvent,
} from "react-draggable";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import { Theme } from "@mui/system";
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
import { LayerStates } from "@/states/controlState";
import LayerItem from "./LayerItem";

const initialPos: ControlPosition = { x: 48, y: 128 };
const initialSize = { width: 320, height: 520 };

const styles = makeStyles({
  resizeBox: { position: "absolute", zIndex: 1000 },
  windowPaper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  windowHeader: (theme: Theme) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "move",
    padding: 1,
    marginBottom: "2px",
    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#FFFFFF3F" : "#0000003F"}`,
  }),
  windowTitle: {
    fontWeight: "bolder",
  },
});

interface LayerControlPanelProps extends WithLocale {
  layerMenuOpen: boolean;
  setLayerMenuOpen: (layerMenuOpen: boolean) => void;
  openDialog: (dialogId: string) => void;
  layerStates: LayerStates;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
}

export default function LayerControlPanel(props: LayerControlPanelProps) {
  const [position, setPosition] = useState<ControlPosition>(initialPos);
  const [size, setSize] = useState(initialSize);

  const {
    layerStates,
    layerMenuOpen,
    setLayerMenuOpen,
    openDialog,
    ...layerProps
  } = props;

  if (!layerMenuOpen) {
    return null;
  }

  // console.log("layerProps", layerProps);

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

  const handleResize = (_e: SyntheticEvent, data: ResizeCallbackData) => {
    setSize({ ...data.size });
  };

  return (
    <Draggable
      handle="#layer-select-header"
      position={position}
      onStop={handleDragStop}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        style={styles.resizeBox as CSSProperties}
        onResize={handleResize}
      >
        <Paper elevation={10} sx={styles.windowPaper} component="div">
          <Box id="layer-select-header" sx={styles.windowHeader}>
            <Box component="span" sx={styles.windowTitle}>
              {i18n.get("Layers")}
            </Box>
            <IconButton size="small" onClick={handleCloseLayerMenu}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <Box sx={{ width: "100%", overflow: "auto", flexGrow: 1 }}>
            <MenuList dense>
              {layerStates.overlays.map((layerState) => (
                <LayerItem
                  key={layerState.id}
                  layerState={layerState}
                  {...layerProps}
                />
              ))}
              {layerStates.overlays.length && <Divider />}
              <LayerItem layerState={layerStates.userPlaces} {...layerProps} />
              <LayerItem
                layerState={layerStates.datasetPlaces}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetBoundary}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetVariable}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetVariable2}
                {...layerProps}
              />
              <LayerItem layerState={layerStates.datasetRgb} {...layerProps} />
              <LayerItem layerState={layerStates.datasetRgb2} {...layerProps} />
              {layerStates.baseMaps.length && <Divider />}
              {layerStates.baseMaps.map((layerState) => (
                <LayerItem
                  key={layerState.id}
                  layerState={layerState}
                  {...layerProps}
                />
              ))}
              <Divider />
              <MenuItem onClick={handleUserBaseMaps}>
                {i18n.get("User Base Maps") + "..."}
              </MenuItem>
              <MenuItem onClick={handleUserOverlays}>
                {i18n.get("User Overlays") + "..."}
              </MenuItem>
            </MenuList>
          </Box>
        </Paper>
      </ResizableBox>
    </Draggable>
  );
}
