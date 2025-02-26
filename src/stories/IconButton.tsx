import MuiIconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import "@fontsource/material-icons";

export interface IconButtonProps {
  iconName: string;
  onClick?: () => void;
}

/**
 * An icon button that receives its icon by font ligature name.
 *
 * @param iconName The icon's font ligature name
 * @param onClick The button's click handler.
 * @constructor
 */
function IconButton({ iconName, onClick }: IconButtonProps) {
  return (
    <MuiIconButton onClick={onClick}>
      <Icon baseClassName="material-icons">{iconName}</Icon>
    </MuiIconButton>
  );
}

export default IconButton;
