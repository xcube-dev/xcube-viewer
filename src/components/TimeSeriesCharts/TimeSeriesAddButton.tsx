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
