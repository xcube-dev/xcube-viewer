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
import MapSnapshotButton from "@/components/MapSnapshotButton";
import { ExportResolution } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
import { WithLocale } from "@/util/lang";

const GROUP_STYLE: CSSProperties = {
  // Same sizes as for OpenLayers
  left: "0.5em",
  top: 65,
};

interface MapControlActionsProps extends WithLocale {
  layerMenuOpen: boolean;
  setLayerMenuOpen: (layerMenuOpen: boolean) => void;

  variableCompareMode: boolean;
  setVariableCompareMode: (variableCompareMode: boolean) => void;

  mapPointInfoBoxEnabled: boolean;
  setMapPointInfoBoxEnabled: (mapPointInfoBoxEnabled: boolean) => void;

  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  exportResolution: ExportResolution;
}

export default function MapControlActions({
  layerMenuOpen,
  setLayerMenuOpen,

  variableCompareMode,
  setVariableCompareMode,

  mapPointInfoBoxEnabled,
  setMapPointInfoBoxEnabled,

  postMessage,
  exportResolution,
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
      <MapSnapshotButton
        postMessage={postMessage}
        exportResolution={exportResolution}
      />
    </MapButtonGroup>
  );
}
