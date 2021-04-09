/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


interface SettingsSubPanelProps {
    label: string;
    value?: string | number;
    onClick?: (event: any) => void;
}

const SettingsSubPanel: React.FC<SettingsSubPanelProps> = (
    {
        label,
        value,
        onClick,
        children,
    }
) => {

    let listItemStyle;
    if (!value) {
        listItemStyle = {marginBottom: 10};
    }

    const listItemText = (<ListItemText primary={label} secondary={value}/>);

    let listItemSecondaryAction;
    if (children) {
        listItemSecondaryAction = (
            <ListItemSecondaryAction>
                {children}
            </ListItemSecondaryAction>
        );
    }

    if (!!onClick) {
        return (
            <ListItem style={listItemStyle} button onClick={onClick}>
                {listItemText}
                {listItemSecondaryAction}
            </ListItem>
        );
    }

    return (
        <ListItem style={listItemStyle}>
            {listItemText}
            {listItemSecondaryAction}
        </ListItem>
    );
};

export default SettingsSubPanel;