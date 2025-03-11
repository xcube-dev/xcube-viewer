/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Divider from "@mui/material/Divider";
import PushPinIcon from "@mui/icons-material/PushPin";

import i18n from "@/i18n";
import { LayerVisibilities } from "@/states/controlState";
import SelectableMenuItem from "@/components/SelectableMenuItem";
import { LayerState } from "@/model/layerState";

interface LayerItemProps {
  layerId: keyof LayerVisibilities;
  layerStates: Record<keyof LayerVisibilities, LayerState>;
  setLayerVisibility: (
    layerId: keyof LayerVisibilities,
    visible: boolean,
  ) => void;
  last?: boolean;
}

export default function LayerItem({
  layerId,
  layerStates,
  setLayerVisibility,
  last,
}: LayerItemProps) {
  const layerState = layerStates[layerId];
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
        onClick={() => setLayerVisibility(layerId, !layerState.visible)}
      />
      {last ? (
        <Divider />
      ) : (
        <Divider
          variant="inset"
          component="li"
          style={{ margin: "0 0 0 52px" }}
        />
      )}
    </>
  );
}
