/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import PushPinIcon from "@mui/icons-material/PushPin";

import i18n from "@/i18n";
import SelectableMenuItem from "@/components/SelectableMenuItem";
import { LayerState } from "@/model/layerState";

interface LayerMenuItemProps {
  layerState: LayerState;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  disableI18n?: boolean;
}

export default function LayerMenuItem({
  layerState,
  setLayerVisibility,
  disableI18n,
}: LayerMenuItemProps) {
  if (layerState.disabled) {
    return null;
  }
  return (
    <>
      <SelectableMenuItem
        title={disableI18n ? layerState.title : i18n.get(layerState.title)}
        subtitle={layerState.subTitle}
        selected={!!layerState.visible}
        secondaryIcon={
          layerState.pinned && <PushPinIcon fontSize="small" color="disabled" />
        }
        onClick={() => setLayerVisibility(layerState.id, !layerState.visible)}
        dense
      />
    </>
  );
}
