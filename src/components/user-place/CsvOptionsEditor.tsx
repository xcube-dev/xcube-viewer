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
import Checkbox from "@mui/material/Checkbox";

import { CsvOptions } from '../../model/user-place/csv';
import CsvTextFieldEditor from "./CsvTextFieldEditor";


interface CsvOptionsEditorProps {
    options: CsvOptions;
    updateOptions: (options: Partial<CsvOptions>) => any;
    className: string;
}

const CsvOptionsEditor: React.FC<CsvOptionsEditorProps> = (
    {
        options,
        updateOptions,
        className
    }
) => {

    return (
        <div>
            <div style={{display: "grid", gap: 12, paddingTop: 12, gridTemplateColumns: "auto auto"}}>
                <CsvTextFieldEditor
                    optionName={'xName'}
                    label={'X/longitude column name'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'yName'}
                    label={'Y/latitude column name'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <span>
                    <Checkbox
                        checked={options.forceGeometry}
                        onChange={e => updateOptions({forceGeometry: e.target.checked})}
                        size="small"
                    />
                    <span>{'Use geometry column'}</span>
                </span>
                <CsvTextFieldEditor
                    optionName={'geometryName'}
                    label={'Geometry column name'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'labelName'}
                    label={'Label column name'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'labelPrefix'}
                    label={'Label prefix (used as fallback)'}
                    options={options}
                    updateOptions={updateOptions}
                />
            </div>
            <div style={{display: "grid", gap: 12, paddingTop: 12,
                gridTemplateColumns: "auto auto auto"}}>
                <CsvTextFieldEditor
                    optionName={'separator'}
                    label={'Separator character'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'comment'}
                    label={'Comment character'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'quote'}
                    label={'Quote character'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'escape'}
                    label={'Escape character'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <div/>
                <span>
                    <Checkbox
                        checked={options.trim}
                        onChange={e => updateOptions({trim: e.target.checked})}
                        size="small"
                    />
                    <span>Remove whitespaces</span>
                </span>
                <CsvTextFieldEditor
                    optionName={'nanToken'}
                    label={'Not-a-number token'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'trueToken'}
                    label={'True token'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <CsvTextFieldEditor
                    optionName={'falseToken'}
                    label={'False token'}
                    options={options}
                    updateOptions={updateOptions}
                />
            </div>
        </div>
    );
}

export default CsvOptionsEditor;