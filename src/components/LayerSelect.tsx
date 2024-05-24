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

import * as React from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { LayerVisibilities } from "@/states/controlState";
import LayerSelectItem from "./LayerSelectItem";
import SelectableMenuItem from "@/components/SelectableMenuItem";

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
  const [menuAnchor, setMenuAnchor] = React.useState<Element | null>(null);

  const handleUserOverlays = () => {
    setMenuAnchor(null);
    openDialog("userOverlays");
  };

  const handleUserBaseMaps = () => {
    setMenuAnchor(null);
    openDialog("userBaseMaps");
  };

  return (
    <>
      <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
        <Tooltip arrow title={i18n.get("Layer visibilities")}>
          <VisibilityIcon />
        </Tooltip>
      </IconButton>
      <Popover
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        keepMounted
      >
        <Paper>
          <MenuList dense>
            <LayerSelectItem layerId="baseMap" {...layerSelectProps} />
            <LayerSelectItem layerId="datasetRgb2" {...layerSelectProps} />
            <LayerSelectItem layerId="datasetRgb" {...layerSelectProps} />
            <LayerSelectItem layerId="datasetVariable2" {...layerSelectProps} />
            <LayerSelectItem layerId="datasetVariable" {...layerSelectProps} />
            <LayerSelectItem layerId="datasetBoundary" {...layerSelectProps} />
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
      </Popover>
    </>
  );
}
