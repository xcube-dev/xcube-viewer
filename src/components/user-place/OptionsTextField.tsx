/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 by the xcube development team and contributors.
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
import TextField from '@mui/material/TextField';

import i18n from '../../i18n';

// noinspection JSUnusedLocalSymbols
const defaults = {
    parse: (text: string) => {
        return text;
    },
    format: (value: any): string => {
        return typeof value === 'string' ? value : `${value}`;
    },
    validate: (_value: any): boolean => {
        return true;
    },
}

interface OptionsTextFieldProps<T, V = string> {
    options: T;
    updateOptions: (options: Partial<T>) => any;
    optionKey: keyof T;
    label: string;
    style?: React.CSSProperties;
    className?: string;
    disabled?: boolean;
    parse?: (text: string) => V;
    format?: (value: V) => string;
    validate?: (value: V) => boolean;
}


function OptionsTextField<T, V>() {
    return (props: OptionsTextFieldProps<T, V>): JSX.Element => {
        const {
            options,
            updateOptions,
            optionKey,
            label,
            style,
            className,
            disabled,
            parse,
            format,
            validate,
        } = props;
        const value: V = options[optionKey] as unknown as V;
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const text = e.target.value;
            const value = (parse || defaults.parse)(text) as V;
            updateOptions({[optionKey]: value} as unknown as Partial<T>)
        };
        return (
            <TextField
                label={i18n.get(label)}
                value={(format || defaults.format)(value)}
                error={!(validate || defaults.validate)(value)}
                onChange={handleChange}
                style={style}
                className={className}
                disabled={disabled}
                size="small"
                variant="standard"
            />
        );
    }
}

export default OptionsTextField;
