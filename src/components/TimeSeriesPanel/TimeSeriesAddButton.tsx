/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { SxProps, Theme } from "@mui/system";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { PlaceGroupTimeSeries, TimeSeries } from "@/model/timeSeries";
import React from "react";

interface TimeSeriesAddButtonProps extends WithLocale {
  sx?: SxProps<Theme>;
  timeSeriesGroupId: string;
  placeGroupTimeSeries: PlaceGroupTimeSeries[];
  addPlaceGroupTimeSeries: (
    timeSeriesGroupId: string,
    timeSeries: TimeSeries,
  ) => void;
}

export default function TimeSeriesAddButton({
  sx,
  timeSeriesGroupId,
  placeGroupTimeSeries,
  addPlaceGroupTimeSeries,
}: TimeSeriesAddButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (timeSeries: TimeSeries) => {
    setAnchorEl(null);
    addPlaceGroupTimeSeries(timeSeriesGroupId, timeSeries);
  };

  const menuItems: React.ReactNode[] = [];
  placeGroupTimeSeries.forEach((pgTs) => {
    Object.getOwnPropertyNames(pgTs.timeSeries).forEach((propertyName) => {
      const menuLabel = `${pgTs.placeGroup.title} / ${propertyName}`;
      menuItems.push(
        <MenuItem
          key={menuLabel}
          onClick={() => handleMenuItemClick(pgTs.timeSeries[propertyName])}
        >
          {menuLabel}
        </MenuItem>,
      );
    });
  });

  const isOpen = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        sx={sx}
        aria-label="Add"
        aria-controls={isOpen ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        onClick={handleButtonClick}
        disabled={menuItems.length === 0}
      >
        <Tooltip arrow title={i18n.get("Add time-series from places")}>
          <AddCircleOutlineIcon fontSize={"inherit"} />
        </Tooltip>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuItems}
      </Menu>
    </>
  );
}
