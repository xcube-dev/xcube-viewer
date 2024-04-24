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
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

const SX: SxProps = { display: "flex", justifyContent: "flex-end", gap: 1 };

interface DoneCancelProps {
  onOk: () => void;
  onCancel: () => void;
  doneDisabled?: boolean;
  cancelDisabled?: boolean;
  size?: "small" | "medium" | "large";
}

export default function DoneCancel({
  onOk,
  onCancel,
  doneDisabled,
  cancelDisabled,
  size,
}: DoneCancelProps) {
  size = size || "medium";
  return (
    <Box sx={SX}>
      <IconButton
        onClick={onOk}
        color="primary"
        disabled={doneDisabled}
        size={size}
      >
        <DoneIcon />
      </IconButton>
      <IconButton
        onClick={onCancel}
        color="primary"
        disabled={cancelDisabled}
        size={size}
      >
        <CancelIcon />
      </IconButton>
    </Box>
  );
}
