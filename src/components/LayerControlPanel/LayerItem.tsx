/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Divider from "@mui/material/Divider";
import PushPinIcon from "@mui/icons-material/PushPin";

import i18n from "@/i18n";
import SelectableMenuItem from "@/components/SelectableMenuItem";
import { LayerState } from "@/model/layerState";

interface LayerItemProps {
  layerState: LayerState;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
}

export default function LayerItem({
  layerState,
  setLayerVisibility,
}: LayerItemProps) {
  if (layerState.disabled) {
    return null;
  }
  return (
    <>
      <SelectableMenuItem
        title={i18n.get(layerState.title)}
        subtitle={layerState.subTitle}
        selected={!!layerState.visible}
        secondaryIcon={
          layerState.pinned && <PushPinIcon fontSize="small" color="disabled" />
        }
        onClick={() => setLayerVisibility(layerState.id, !layerState.visible)}
      />
      <Divider
        variant="inset"
        component="li"
        style={{ margin: "0 0 0 52px" }}
      />
    </>
  );
}
