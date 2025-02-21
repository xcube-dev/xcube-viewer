/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";

import { getLayerTitle, LayerDefinition } from "@/model/layerDefinition";

interface LayerSelectMenuProps {
  anchorElement: Element | null;
  layers: LayerDefinition[];
  selectedLayerId: string | null;
  setSelectedLayerId: (selectedLayerId: string | null) => void;
  onClose: () => void;
}

const LayerSelectMenu = ({
  anchorElement,
  layers,
  selectedLayerId,
  setSelectedLayerId,
  onClose,
}: LayerSelectMenuProps) => {
  return (
    <Menu
      anchorEl={anchorElement}
      keepMounted
      open={Boolean(anchorElement)}
      onClose={onClose}
    >
      {anchorElement &&
        layers.map((layer) => (
          <MenuItem
            key={layer.id}
            selected={layer.id === selectedLayerId}
            onClick={() =>
              setSelectedLayerId(layer.id === selectedLayerId ? null : layer.id)
            }
            dense
          >
            <ListItemText primary={getLayerTitle(layer)} />
          </MenuItem>
        ))}
    </Menu>
  );
};

export default LayerSelectMenu;
