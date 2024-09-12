/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
