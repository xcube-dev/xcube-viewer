/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { makeStyles } from "@/util/styles";
import { ExprPartType } from "@/components/UserVariablesDialog/utils";

const styles = makeStyles({
  expressionPart: { padding: 0.2 },
  expressionPartChip: { fontFamily: "monospace" },
});

interface ExprPartChipProps {
  part: string;
  partType: ExprPartType;
  onPartClicked: (part: string) => void;
}

export default function ExprPartChip({
  part,
  partType,
  onPartClicked,
}: ExprPartChipProps) {
  return (
    <Box component="span" sx={styles.expressionPart}>
      <Chip
        label={part}
        sx={styles.expressionPartChip}
        size="small"
        variant="outlined"
        color={
          partType === "variables" || partType === "constants"
            ? "default"
            : partType.includes("Functions")
              ? "primary"
              : "secondary"
        }
        onClick={() => onPartClicked(part)}
      />
    </Box>
  );
}
