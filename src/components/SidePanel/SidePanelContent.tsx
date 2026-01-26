/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";

import type { PanelModel } from "./panelModel";
import styles from "./styles";

export interface SidePanelContentProps {
  selectedPanel?: PanelModel;
}

function SidePanelContent({ selectedPanel }: SidePanelContentProps) {
  return <Box sx={styles.panelContent}>{selectedPanel?.content}</Box>;
}

export default SidePanelContent;
