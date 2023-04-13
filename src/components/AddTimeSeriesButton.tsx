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
import { PlaceGroupSchema } from "../model/place";


interface AddTimeSeriesButtonProps extends WithLocale {
    className: string;
    placeGroupSchemas: PlaceGroupSchema[];
}

const AddTimeSeriesButton: React.FC<AddTimeSeriesButtonProps> = (
    {
        className,
        placeGroupSchemas
    }
) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl);

    let menuItems: React.ReactNode[] = [];
    placeGroupSchemas
        .filter(placeGroupSchema => typeof placeGroupSchema.properties["time"] === "string")
        .forEach(placeGroupSchema => {
            Object.getOwnPropertyNames(placeGroupSchema.properties).forEach(propertyName => {
                const propertyType = placeGroupSchema.properties[propertyName];
                if (propertyType === "number" || propertyType === "boolean") {
                    const menuLabel = `${placeGroupSchema.title} / ${propertyName}`;
                    menuItems.push(<MenuItem onClick={handleClose}>{menuLabel}</MenuItem>);
                }
            })
        });

    return (
        <>
            <IconButton
                size="large"
                className={className}
                aria-label="Add"
                aria-controls={isOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                onClick={handleClick}
                disabled={menuItems.length === 0}
            >
                <AddCircleOutlineIcon/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
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


