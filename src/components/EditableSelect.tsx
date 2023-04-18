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
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import ControlBarItem from './ControlBarItem';


interface EditableSelectProps {
    itemValue: string;
    setItemValue: (itemValue: string) => void;
    validateItemValue?: (itemValue: string) => boolean;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    labelText: string;
    select: React.ReactNode,
    actions?: React.ReactNode,
}

const EditableSelect: React.FC<EditableSelectProps> = (
    {
        itemValue,
        setItemValue,
        validateItemValue,
        editMode,
        setEditMode,
        labelText,
        select,
        actions
    }
) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [interimValue, setInterimValue] = React.useState("");

    React.useEffect(() => {
        if (editMode) {
            setInterimValue(itemValue);
        }
    }, [editMode, itemValue, setInterimValue]);

    React.useEffect(() => {
        if (editMode) {
            const inputEl = inputRef.current;
            if (inputEl !== null) {
                inputEl.focus();
                inputEl.select();
            }
        }
    }, [editMode]);

    const inputLabel = (
        <InputLabel
            shrink
            htmlFor="place-select"
        >
            {labelText}
        </InputLabel>
    );

    if (!editMode) {
        return (
            <ControlBarItem
                label={inputLabel}
                control={select}
                actions={actions}
            />
        );
    }

    const isValid = validateItemValue ? validateItemValue(interimValue) : true;

    const input = (
        <Input
            value={interimValue}
            error={!isValid}
            inputRef={inputRef}
            onBlur={() => setEditMode(false)}
            onKeyUp={(e) => {
                if (e.code === "Escape") {
                    setEditMode(false);
                } else if (e.code === "Enter" && isValid) {
                    setEditMode(false);
                    setItemValue(interimValue);
                }
            }}
            onChange={(e) => {
                setInterimValue(e.currentTarget.value);
            }}
        />
    );

    return (
        <ControlBarItem
            label={inputLabel}
            control={input}
        />
    );
};

export default EditableSelect;
