/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2023 by the xcube development team and contributors.
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

import * as React from 'react';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { WithLocale } from '../util/lang';
import { PlaceGroupTimeSeries, TimeSeries } from "../model/timeSeries";


interface AddTimeSeriesButtonProps extends WithLocale {
    className: string;
    timeSeriesGroupId: string;
    placeGroupTimeSeries: PlaceGroupTimeSeries[];
    addPlaceGroupTimeSeries: (timeSeriesGroupId: string, timeSeries: TimeSeries) => void;
}

const AddTimeSeriesButton: React.FC<AddTimeSeriesButtonProps> = (
    {
        className,
        timeSeriesGroupId,
        placeGroupTimeSeries,
        addPlaceGroupTimeSeries
    }
) => {
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

    let menuItems: React.ReactNode[] = [];
    placeGroupTimeSeries.forEach(pgTs => {
        Object.getOwnPropertyNames(pgTs.timeSeries).forEach(propertyName => {
            const menuLabel = `${pgTs.placeGroup.title} / ${propertyName}`;
            menuItems.push(
                <MenuItem
                    onClick={() => handleMenuItemClick(pgTs.timeSeries[propertyName])}
                >
                    {menuLabel}
                </MenuItem>
            );
        });
    });

    const isOpen = Boolean(anchorEl);

    return (
        <>
            <IconButton
                size="large"
                className={className}
                aria-label="Add"
                aria-controls={isOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                onClick={handleButtonClick}
                disabled={menuItems.length === 0}
            >
                <AddCircleOutlineIcon/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </Menu>
        </>
    )
};

export default AddTimeSeriesButton;


