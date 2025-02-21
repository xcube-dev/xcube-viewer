/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";

import Markdown from "@/components/Markdown";

interface MarkdownPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose?: () => void;
  markdownText?: string;
}

export default function MarkdownPopover({
  anchorEl,
  markdownText,
  open,
  onClose,
}: MarkdownPopoverProps) {
  if (!markdownText) {
    return null;
  }
  return (
    <Popover anchorEl={anchorEl} open={open} onClose={onClose}>
      <Paper
        sx={{
          width: "32em",
          overflowY: "auto",
          fontSize: "smaller",
          padding: 2,
        }}
      >
        <Markdown text={markdownText} />
      </Paper>
    </Popover>
  );
}
