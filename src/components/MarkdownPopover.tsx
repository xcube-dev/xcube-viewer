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
