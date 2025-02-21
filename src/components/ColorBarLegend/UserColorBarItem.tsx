/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import ColorBarItem from "./ColorBarItem";
import {
  COLOR_BAR_ITEM_GAP,
  COLOR_BAR_ITEM_WIDTH,
  COLOR_BAR_ITEM_HEIGHT,
} from "./constants";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    width: COLOR_BAR_ITEM_WIDTH,
    height: COLOR_BAR_ITEM_HEIGHT,
    gap: COLOR_BAR_ITEM_GAP,
    marginTop: COLOR_BAR_ITEM_GAP,
  },
});

interface UserColorBarItemProps {
  imageData?: string;
  title?: string;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function UserColorBarItem({
  imageData,
  title,
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
    <>
      <Box sx={styles.container}>
        <ColorBarItem
          imageData={imageData}
          selected={selected}
          onSelect={onSelect}
          width={COLOR_BAR_ITEM_WIDTH - 20}
          title={title}
        />
        <IconButton size="small" onClick={handleMoreOpen}>
          <MoreHorizIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Popover
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        transformOrigin={{ vertical: "center", horizontal: "center" }}
        open={moreOpen}
        anchorEl={moreAnchor}
        onClose={handleMoreClose}
      >
        <Box>
          <IconButton onClick={handleEdit} size="small" disabled={disabled}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton onClick={handleRemove} size="small" disabled={disabled}>
            <RemoveCircleOutlineIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Popover>
    </>
  );
}
