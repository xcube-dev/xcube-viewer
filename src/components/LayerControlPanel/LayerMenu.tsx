/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactNode } from "react";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";

import type { WithLocale } from "@/util/lang";
import type { LayerState } from "@/model/layerState";
import LayerMenuItem from "./LayerMenuItem";

interface LayerMenuProps extends WithLocale {
  layerStates: LayerState[];
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  disableI18n?: boolean;
  extraItems?: ReactNode;
}

export default function LayerMenu({
  layerStates,
  setLayerVisibility,
  disableI18n,
  extraItems,
}: LayerMenuProps) {
  return (
    <MenuList dense disablePadding>
      {layerStates.map((layerState) => (
        <LayerMenuItem
          key={layerState.id}
          layerState={layerState}
          setLayerVisibility={setLayerVisibility}
          disableI18n={disableI18n}
        />
      ))}
      {layerStates.length && extraItems && <Divider style={{ margin: 0 }} />}
      {extraItems}
    </MenuList>
  );
}
