/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ReactNode } from "react";
import { alpha } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CalculateIcon from "@mui/icons-material/Calculate";

interface HeaderBarProps {
  selected: boolean;
  title: ReactNode;
  actions: ReactNode;
}

export default function HeaderBar({
  selected,
  title,
  actions,
}: HeaderBarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected && {
          background: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      <CalculateIcon />
      <Typography sx={{ flex: "1 1 100%", paddingLeft: 1 }}>{title}</Typography>
      {actions}
    </Toolbar>
  );
}
