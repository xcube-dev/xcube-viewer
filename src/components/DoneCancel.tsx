/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

import HelpButton from "@/components/HelpButton";

const styles: Record<string, SxProps> = {
  container: { display: "flex", justifyContent: "space-between", gap: 0.2 },
  doneCancel: { display: "flex", gap: 0.2 },
};

interface DoneCancelProps {
  onDone: () => void;
  onCancel: () => void;
  doneDisabled?: boolean;
  cancelDisabled?: boolean;
  size?: "small" | "medium" | "large";
  helpUrl?: string;
}

export default function DoneCancel({
  onDone,
  onCancel,
  doneDisabled,
  cancelDisabled,
  size,
  helpUrl,
}: DoneCancelProps) {
  return (
    <Box sx={styles.container}>
      <Box>{helpUrl && <HelpButton size={size} helpUrl={helpUrl} />}</Box>

      <Box sx={styles.doneCancel}>
        <IconButton
          onClick={onDone}
          color="primary"
          disabled={doneDisabled}
          size={size}
        >
          <DoneIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          onClick={onCancel}
          color="primary"
          disabled={cancelDisabled}
          size={size}
        >
          <CancelIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
}
