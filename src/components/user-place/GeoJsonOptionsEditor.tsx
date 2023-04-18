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
import { GeoJsonOptions } from '../../model/user-place/geojson';


interface GeoJsonOptionsEditorProps {
    options: GeoJsonOptions;
    updateOptions: (options: Partial<GeoJsonOptions>) => any;
    className: string;
}

const GeoJsonOptionsEditor: React.FC<GeoJsonOptionsEditorProps> = (
    {
        options,
        updateOptions,
        className
    }
) => {
    function handleGroupNamesChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        updateOptions({groupNames: e.target.value});
    }

    function handleGroupPrefixChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        updateOptions({groupPrefix: e.target.value});
    }

    function handleLabelNamesChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        updateOptions({labelNames: e.target.value});
    }

    function handleLabelPrefixChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        updateOptions({labelPrefix: e.target.value});
    }

    return (
        <div className={className}>
            <div style={{display: "grid", gap: 12, paddingTop: 12, gridTemplateColumns: "auto auto"}}>
                <TextField
                    label={i18n.get('Group property names')}
                    value={options.groupNames}
                    onChange={handleGroupNamesChange}
                    size="small"
                    variant="standard"
                    style={{flexGrow: 1, marginRight: 10}}
                />
                <TextField
                    label={i18n.get('Group prefix (used as fallback)')}
                    value={options.groupPrefix}
                    onChange={handleGroupPrefixChange}
                    size="small"
                    variant="standard"
                    style={{flexGrow: 1}}
                />
                <TextField
                    label={i18n.get('Label property names')}
                    value={options.labelNames}
                    onChange={handleLabelNamesChange}
                    size="small"
                    variant="standard"
                    style={{flexGrow: 1, marginRight: 10}}
                />
                <TextField
                    label={i18n.get('Label prefix (used as fallback)')}
                    value={options.labelPrefix}
                    onChange={handleLabelPrefixChange}
                    size="small"
                    variant="standard"
                    style={{flexGrow: 1}}
                />
            </div>
        </div>
    );
}

export default GeoJsonOptionsEditor;
