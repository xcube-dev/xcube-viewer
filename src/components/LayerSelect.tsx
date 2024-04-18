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
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Menu from "@mui/material/Menu";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import LayerSelectItem from "@/components/LayerSelectItem";
import { LayerVisibilities } from "@/states/controlState";

// noinspection JSUnusedLocalSymbols
const styles = (_theme: Theme) => createStyles({});

interface LayerSelectProps extends WithStyles<typeof styles>, WithLocale {
  layerVisibilities: LayerVisibilities;
  setLayerVisibility: (
    layerId: keyof LayerVisibilities,
    visible: boolean,
  ) => void;
}

const _LayerSelect: React.FC<LayerSelectProps> = (props) => {
  const [menuAnchor, setMenuAnchor] = React.useState<Element | null>(null);

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
        <LayerSelectItem layerId="baseMap" {...props} />
        <LayerSelectItem layerId="datasetRgb" {...props} />
        <LayerSelectItem layerId="datasetVariable" {...props} />
        <LayerSelectItem layerId="datasetPlaces" {...props} />
        <LayerSelectItem layerId="userPlaces" {...props} />
        <LayerSelectItem layerId="overlay" {...props} />
      </Menu>
    </>
  );
};

const LayerSelect = withStyles(styles)(_LayerSelect);
export default LayerSelect;
