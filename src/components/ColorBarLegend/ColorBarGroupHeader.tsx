/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme } from "@mui/system";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { COLOR_BAR_ITEM_GAP } from "./constants";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  colorBarGroupTitle: (theme: Theme) => ({
    marginTop: theme.spacing(2 * COLOR_BAR_ITEM_GAP),
    fontSize: "small",
    color: theme.palette.text.secondary,
  }),
});

interface ColorBarGroupHeaderProps {
  title: string;
  description: string;
}

export default function ColorBarGroupHeader({
  title,
  description,
}: ColorBarGroupHeaderProps) {
  return (
    <Tooltip arrow title={description} placement="left">
      <Box sx={styles.colorBarGroupTitle}>{title}</Box>
    </Tooltip>
  );
}
