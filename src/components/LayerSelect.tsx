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
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { LayerVisibilities } from "@/states/controlState";
import LayerSelectItem from "./LayerSelectItem";

// noinspection JSUnusedLocalSymbols
const styles = (_theme: Theme) => createStyles({});

interface LayerSelectProps extends WithStyles<typeof styles>, WithLocale {
  openDialog: (dialogId: string) => void;
  layerVisibilities: LayerVisibilities;
  setLayerVisibility: (
    layerId: keyof LayerVisibilities,
    visible: boolean,
  ) => void;
}

const _LayerSelect: React.FC<LayerSelectProps> = (props) => {
  const { openDialog, ...otherProps } = props;
  const [menuAnchor, setMenuAnchor] = React.useState<Element | null>(null);

  console.log("_LayerSelect", props);

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
      <Menu
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <LayerSelectItem layerId="baseMap" {...otherProps} />
        <LayerSelectItem layerId="datasetRgb" {...otherProps} />
        <LayerSelectItem layerId="datasetVariable" {...otherProps} />
        <LayerSelectItem layerId="datasetBoundary" {...otherProps} />
        <LayerSelectItem layerId="datasetPlaces" {...otherProps} />
        <LayerSelectItem layerId="userPlaces" {...otherProps} />
        <LayerSelectItem layerId="overlay" {...otherProps} />
        <Divider />
        <MenuItem onClick={handleUserBaseMaps}>
          {i18n.get("User Base Maps") + "..."}
        </MenuItem>
        <MenuItem onClick={handleUserOverlays}>
          {i18n.get("User Overlays") + "..."}
        </MenuItem>
      </Menu>
    </>
  );
};

const LayerSelect = withStyles(styles)(_LayerSelect);
export default LayerSelect;
