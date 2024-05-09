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

import { useRef, useState } from "react";
import { SxProps } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import useFetchText from "@/hooks/useFetchText";
import MarkdownPopover from "@/components/MarkdownPopover";

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
  const [helpAnchorEl, setHelpAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const helpText = useFetchText(helpUrl);

  const handleHelpOpen = () => {
    setHelpAnchorEl(helpButtonRef.current);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  return (
    <Box sx={styles.container}>
      <Box>
        {helpText && (
          <>
            <IconButton
              onClick={handleHelpOpen}
              size={size}
              ref={helpButtonRef}
            >
              <HelpOutlineIcon fontSize="inherit" />
            </IconButton>
            <MarkdownPopover
              anchorEl={helpAnchorEl}
              open={!!helpAnchorEl}
              onClose={handleHelpClose}
              markdownText={helpText}
            />
          </>
        )}
      </Box>

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
