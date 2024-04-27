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

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import ColorBarItem from "./ColorBarItem";

interface UserColorBarItemProps {
  imageData?: string;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function UserColorBarItem({
  imageData,
  selected,
  onEdit,
  onRemove,
  onSelect,
  disabled,
}: UserColorBarItemProps) {
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const handleMoreOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchor(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchor(null);
  };

  const handleEdit = () => {
    setMoreAnchor(null);
    onEdit();
  };

  const handleRemove = () => {
    setMoreAnchor(null);
    onRemove();
  };

  const moreOpen = Boolean(moreAnchor);

  return (
    <Box sx={{ display: "flex", gap: 1, width: 240, marginTop: 0.2 }}>
      <ColorBarItem
        name={""}
        imageData={imageData}
        selected={selected}
        onSelect={onSelect}
        width={200}
      />
      <Box
        onMouseEnter={handleMoreOpen}
        onMouseLeave={handleMoreClose}
        fontSize="small"
      >
        <MoreHorizIcon fontSize="inherit" />
      </Box>
      <Popover
        sx={{
          pointerEvents: "none",
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        open={moreOpen}
        anchorEl={moreAnchor}
        onClose={handleMoreClose}
        disableRestoreFocus
      >
        <Box onMouseLeave={handleMoreClose}>
          <IconButton onClick={handleEdit} size="small" disabled={disabled}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton onClick={handleRemove} size="small" disabled={disabled}>
            <RemoveCircleOutlineIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
}
