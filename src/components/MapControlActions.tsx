/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties } from "react";
import CompareIcon from "@mui/icons-material/Compare";
import LayersIcon from "@mui/icons-material/Layers";
import MessageIcon from "@mui/icons-material/Message";

import i18n from "@/i18n";
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
        tooltipTitle={i18n.get("Show or hide layers panel")}
        selected={layerMenuOpen}
        onSelect={(_e, selected) => void setLayerMenuOpen(selected)}
      />
      <MapButton
        icon={<CompareIcon fontSize={"small"} />}
        tooltipTitle={i18n.get("Turn layer split mode on or off")}
        selected={variableCompareMode}
        onSelect={(_e, selected) => void setVariableCompareMode(selected)}
      />
      <MapButton
        icon={<MessageIcon fontSize={"small"} />}
        tooltipTitle={i18n.get("Turn info box on or off")}
        selected={mapPointInfoBoxEnabled}
        onSelect={(_e, selected) => void setMapPointInfoBoxEnabled(selected)}
      />
    </MapButtonGroup>
  );
}
