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
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { LayerVisibilities } from "@/states/controlState";
import LayerItem from "./LayerItem";
import { LayerState } from "@/model/layerState";

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
  layerStates: Record<keyof LayerVisibilities, LayerState>;
  setLayerVisibility: (
    layerId: keyof LayerVisibilities,
    visible: boolean,
  ) => void;
}

export default function LayerControlPanel(props: LayerControlPanelProps) {
  const [position, setPosition] = useState<ControlPosition>(initialPos);
  const [size, setSize] = useState(initialSize);

  const { layerMenuOpen, setLayerMenuOpen, openDialog, ...layerProps } = props;

  if (!layerMenuOpen) {
    return null;
  }

  console.log("layerProps", layerProps);

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
              {/*<Divider />*/}
              <LayerItem layerId="overlay" {...layerProps} />
              <LayerItem layerId="userPlaces" {...layerProps} />
              <LayerItem layerId="datasetPlaces" {...layerProps} />
              <LayerItem layerId="datasetBoundary" {...layerProps} />
              <LayerItem layerId="datasetVariable" {...layerProps} />
              <LayerItem layerId="datasetVariable2" {...layerProps} />
              <LayerItem layerId="datasetRgb" {...layerProps} />
              <LayerItem layerId="datasetRgb2" {...layerProps} />
              <LayerItem layerId="baseMap" {...layerProps} last={true} />
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
