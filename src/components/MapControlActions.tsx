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

import { CSSProperties } from "react";
import CompareIcon from "@mui/icons-material/Compare";
import LayersIcon from "@mui/icons-material/Layers";
import MessageIcon from "@mui/icons-material/Message";

import MapButtonGroup from "@/components/Viewer/MapButtonGroup";
import MapButton from "@/components/Viewer/MapButton";

const GROUP_STYLE: CSSProperties = {
  left: "0.5em",
  top: 65,
};

interface MapControlActionsProps {
  layerMenuOpen: boolean;
  setLayerMenuOpen: (layerMenuOpen: boolean) => void;

  variableCompareMode: boolean;
  setVariableCompareMode: (variableCompareMode: boolean) => void;

  mapPointInfoBoxEnabled: boolean;
  setMapPointInfoBoxEnabled: (mapPointInfoBoxEnabled: boolean) => void;
}

export default function MapControlActions({
  layerMenuOpen,
  setLayerMenuOpen,

  variableCompareMode,
  setVariableCompareMode,

  mapPointInfoBoxEnabled,
  setMapPointInfoBoxEnabled,
}: MapControlActionsProps) {
  return (
    <MapButtonGroup style={GROUP_STYLE}>
      <MapButton
        icon={<LayersIcon fontSize={"small"} />}
        selected={layerMenuOpen}
        onSelect={(_e, selected) => void setLayerMenuOpen(selected)}
      />
      <MapButton
        icon={<CompareIcon fontSize={"small"} />}
        selected={variableCompareMode}
        onSelect={(_e, selected) => void setVariableCompareMode(selected)}
      />
      <MapButton
        icon={<MessageIcon fontSize={"small"} />}
        selected={mapPointInfoBoxEnabled}
        onSelect={(_e, selected) => void setMapPointInfoBoxEnabled(selected)}
      />
    </MapButtonGroup>
  );
}
