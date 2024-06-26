import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";

import { getLayerTitle, LayerDefinition } from "@/model/layerDefinition";

interface LayerMenuProps {
  anchorElement: Element | null;
  layers: LayerDefinition[];
  selectedLayerId: string | null;
  setSelectedLayerId: (selectedLayerId: string | null) => void;
  onClose: () => void;
}

const LayerMenu = ({
  anchorElement,
  layers,
  selectedLayerId,
  setSelectedLayerId,
  onClose,
}: LayerMenuProps) => {
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

export default LayerMenu;
