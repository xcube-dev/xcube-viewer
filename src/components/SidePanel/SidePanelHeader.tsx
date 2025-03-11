/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { PanelModel } from "./panelModel";
import styles from "./styles";

export interface SidePanelHeaderProps {
  selectedPanel: PanelModel;
}

function SidePanelHeader({ selectedPanel }: SidePanelHeaderProps) {
  return (
    <Box sx={styles.panelHeader}>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        sx={{ textTransform: "uppercase", fontWeight: "normal" }}
      >
        {selectedPanel.title}
      </Typography>
    </Box>
  );
}

export default SidePanelHeader;
