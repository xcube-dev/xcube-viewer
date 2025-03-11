/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme } from "@mui/system";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@/util/styles";

import { COLOR_BAR_ITEM_GAP, COLOR_BAR_ITEM_WIDTH } from "./constants";
import { getBorderStyle } from "./style";

const colorBarItemStyle = (theme: Theme) => ({
  marginTop: theme.spacing(COLOR_BAR_ITEM_GAP),
  height: 20,
  border: getBorderStyle(theme),
  cursor: "pointer",
});

const styles = makeStyles({
  colorBarItem: (theme: Theme) => ({
    ...colorBarItemStyle(theme),
  }),
  colorBarItemSelected: (theme: Theme) => ({
    ...colorBarItemStyle(theme),
    borderColor: "blue",
  }),
});

interface ColorBarItemProps {
  imageData?: string;
  selected?: boolean;
  onSelect?: () => void;
  width?: number | string;
  title?: string;
}

export default function ColorBarItem({
  imageData,
  selected,
  onSelect,
  width,
  title,
}: ColorBarItemProps) {
  let image = (
    <img
      src={imageData ? `data:image/png;base64,${imageData}` : undefined}
      alt={imageData ? "color bar" : "error"}
      width={"100%"}
      height={"100%"}
      onClick={onSelect}
    />
  );

  if (title) {
    image = (
      <Tooltip arrow title={title} placement="left">
        {image}
      </Tooltip>
    );
  }

  return (
    <Box
      width={width || COLOR_BAR_ITEM_WIDTH}
      sx={selected ? styles.colorBarItemSelected : styles.colorBarItem}
    >
      {image}
    </Box>
  );
}
