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
import Draggable from "react-draggable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { LayerVisibilities } from "@/states/controlState";
import LayerSelectItem from "./LayerSelectItem";
import SelectableMenuItem from "@/components/SelectableMenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  windowPaper: {
    position: "absolute",
    top: "60px",
    left: "-120px",
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

interface LayerSelectProps extends WithLocale {
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
}

export default function LayerSelect(props: LayerSelectProps) {
  const {
    openDialog,
    variableCompareMode,
    setVariableCompareMode,
    ...layerSelectProps
  } = props;
  // const [menuAnchor, setMenuAnchor] = React.useState<Element | null>(null);
  const [open, setOpen] = useState(false);

  const handleUserOverlays = () => {
    // setMenuAnchor(null);
    openDialog("userOverlays");
  };

  const handleUserBaseMaps = () => {
    // setMenuAnchor(null);
    openDialog("userBaseMaps");
  };

  return (
    <>
      <ToggleButton
        value="open"
        selected={open}
        onClick={() => setOpen(!open)}
        size="small"
      >
        <Tooltip arrow title={i18n.get("Layer visibilities")}>
          <VisibilityIcon fontSize={"inherit"} />
        </Tooltip>
      </ToggleButton>
      {open && (
        <Draggable handle="#layer-select-header">
          <Paper elevation={10} sx={styles.windowPaper}>
            <Box id="layer-select-header" sx={styles.windowHeader}>
              <Box component="span" sx={styles.windowTitle}>
                {i18n.get("Layers")}
              </Box>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <MenuList dense>
              <Divider />
              <LayerSelectItem layerId="baseMap" {...layerSelectProps} />
              <LayerSelectItem layerId="datasetRgb2" {...layerSelectProps} />
              <LayerSelectItem layerId="datasetRgb" {...layerSelectProps} />
              <LayerSelectItem
                layerId="datasetVariable2"
                {...layerSelectProps}
              />
              <LayerSelectItem
                layerId="datasetVariable"
                {...layerSelectProps}
              />
              <LayerSelectItem
                layerId="datasetBoundary"
                {...layerSelectProps}
              />
              <LayerSelectItem layerId="datasetPlaces" {...layerSelectProps} />
              <LayerSelectItem layerId="userPlaces" {...layerSelectProps} />
              <LayerSelectItem layerId="overlay" {...layerSelectProps} />
              <Divider />
              <SelectableMenuItem
                title={i18n.get("Compare Mode (Swipe)")}
                selected={variableCompareMode}
                onClick={() => setVariableCompareMode(!variableCompareMode)}
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
      )}
    </>
  );
}
