/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
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
import { LayerStates, LayerVisibilities } from "@/states/controlState";
import LayerItem from "./LayerItem";
import { LayerGroup } from "@/model/layerDefinition";
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
  layerStates: LayerStates;
  setLayerVisibilities: (layerVisibilities: LayerVisibilities) => void;
}

export default function LayerControlPanel(props: LayerControlPanelProps) {
  const [position, setPosition] = useState<ControlPosition>(initialPos);
  const [size, setSize] = useState(initialSize);

  const {
    layerStates,
    layerMenuOpen,
    setLayerMenuOpen,
    openDialog,
    setLayerVisibilities,
    ...layerProps
  } = props;

  const setLayerVisibility = useCallback(
    (layerId: string, visible: boolean) => {
      const layerVisibilities: LayerVisibilities = { [layerId]: visible };
      if (visible) {
        const layer = layerStates[layerId];
        if (layer && layer.type && layer.exclusive) {
          Object.keys(layerStates).forEach((otherLayerId) => {
            const otherLayer = layerStates[otherLayerId];
            if (
              otherLayer &&
              otherLayer.type === layer.type &&
              otherLayer.exclusive &&
              otherLayer.visible
            ) {
              layerVisibilities[otherLayerId] = false;
            }
          });
        }
      }
      setLayerVisibilities(layerVisibilities);
    },
    [layerStates, setLayerVisibilities],
  );

  const overlays = useMemo(
    () => filterLayerStates(layerStates, "overlays"),
    [layerStates],
  );

  const baseMaps = useMemo(
    () => filterLayerStates(layerStates, "baseMaps"),
    [layerStates],
  );

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
              {overlays.map((layerState) => (
                <LayerItem
                  key={layerState.id}
                  layerState={layerState}
                  setLayerVisibility={setLayerVisibility}
                  {...layerProps}
                />
              ))}
              {overlays.length && <Divider />}
              <LayerItem
                layerState={layerStates.userPlaces}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetPlaces}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetBoundary}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetVariable}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetVariable2}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetRgb}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              <LayerItem
                layerState={layerStates.datasetRgb2}
                setLayerVisibility={setLayerVisibility}
                {...layerProps}
              />
              {baseMaps.length && <Divider />}
              {baseMaps.map((layerState) => (
                <LayerItem
                  key={layerState.id}
                  layerState={layerState}
                  setLayerVisibility={setLayerVisibility}
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

function filterLayerStates(
  layerStates: LayerStates,
  layerType: LayerGroup,
): LayerState[] {
  return Object.keys(layerStates)
    .filter((k) => layerStates[k].type === layerType)
    .map((k) => layerStates[k])
    .sort((s1, s2) => s1.title.localeCompare(s2.title));
}
