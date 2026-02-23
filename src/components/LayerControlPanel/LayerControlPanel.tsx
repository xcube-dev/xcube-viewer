/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import {
  type CSSProperties,
  type SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import Draggable, {
  type ControlPosition,
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { ResizableBox, type ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/system";
import MuiAccordion, { type AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import type { WithLocale } from "@/util/lang";
import {
  LayerGroupStates,
  LayerStates,
  LayerVisibilities,
} from "@/states/controlState";
import type { LayerGroup } from "@/model/layerDefinition";
import type { LayerState } from "@/model/layerState";
import LayerMenu from "@/components/LayerControlPanel/LayerMenu";

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
    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#FFFFFF3F" : "#0000003F"}`,
  }),
  windowTitle: {
    fontWeight: "bolder",
  },
});

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  minHeight: 32,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginRight: theme.spacing(0),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme: _ }) => ({
  padding: 0,
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

interface LayerControlPanelProps extends WithLocale {
  layerMenuOpen: boolean;
  setLayerMenuOpen: (layerMenuOpen: boolean) => void;
  openDialog: (dialogId: string) => void;
  layerStates: LayerStates;
  setLayerVisibilities: (layerVisibilities: LayerVisibilities) => void;
  layerGroupStates: LayerGroupStates;
  setLayerGroupStates: (layerGroupStates: Partial<LayerGroupStates>) => void;
}

export default function LayerControlPanel({
  layerStates,
  layerMenuOpen,
  setLayerMenuOpen,
  openDialog,
  setLayerVisibilities,
  layerGroupStates,
  setLayerGroupStates,
}: LayerControlPanelProps) {
  const [position, setPosition] = useState<ControlPosition>(initialPos);
  const [size, setSize] = useState(initialSize);

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

  const handleOverlaysStateChange = useCallback(
    (_event: SyntheticEvent, newExpanded: boolean) => {
      setLayerGroupStates({ overlays: newExpanded });
    },
    [setLayerGroupStates],
  );

  const handleBaseMapsStateChange = useCallback(
    (_event: SyntheticEvent, newExpanded: boolean) => {
      setLayerGroupStates({ baseMaps: newExpanded });
    },
    [setLayerGroupStates],
  );

  const handlePredefinedStateChange = useCallback(
    (_event: SyntheticEvent, newExpanded: boolean) => {
      setLayerGroupStates({ predefined: newExpanded });
    },
    [setLayerGroupStates],
  );

  const overlays = useMemo(
    () => filterLayerStates(layerStates, "overlays"),
    [layerStates],
  );

  const baseMaps = useMemo(
    () => filterLayerStates(layerStates, "baseMaps"),
    [layerStates],
  );

  const predefined = useMemo(
    () =>
      [
        layerStates.userPlaces,
        layerStates.datasetPlaces,
        layerStates.datasetBoundary,
        layerStates.datasetVariable,
        layerStates.datasetVariable2,
        layerStates.datasetRgb,
        layerStates.datasetRgb2,
      ].filter((layerState) => !!layerState),
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
            <Accordion
              expanded={layerGroupStates.overlays}
              onChange={handleOverlaysStateChange}
            >
              <AccordionSummary id="overlays">
                <Typography component="span">{i18n.get("Overlays")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LayerMenu
                  layerStates={overlays}
                  setLayerVisibility={setLayerVisibility}
                  extraItems={
                    <MenuItem onClick={handleUserOverlays}>
                      {i18n.get("User Overlays") + "..."}
                    </MenuItem>
                  }
                  disableI18n
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={layerGroupStates.predefined}
              onChange={handlePredefinedStateChange}
            >
              <AccordionSummary id="predefines">
                <Typography component="span">
                  {i18n.get("Predefined")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LayerMenu
                  layerStates={predefined}
                  setLayerVisibility={setLayerVisibility}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={layerGroupStates.baseMaps}
              onChange={handleBaseMapsStateChange}
            >
              <AccordionSummary id="baseMaps">
                <Typography component="span">
                  {i18n.get("Base maps")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LayerMenu
                  layerStates={baseMaps}
                  setLayerVisibility={setLayerVisibility}
                  extraItems={
                    <MenuItem onClick={handleUserBaseMaps}>
                      {i18n.get("User Base Maps") + "..."}
                    </MenuItem>
                  }
                  disableI18n
                />
              </AccordionDetails>
            </Accordion>
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
