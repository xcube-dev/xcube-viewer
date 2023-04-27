/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2023 by the xcube development team and contributors.
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

import { WktOptions } from '../../model/user-place/wkt';
import OptionsField from "./OptionsTextField";


const WktTextField = OptionsField<WktOptions, string>();


interface WktOptionsEditorProps {
    options: WktOptions;
    updateOptions: (options: Partial<WktOptions>) => any;
    className: string;
}

const WktOptionsEditor: React.FC<WktOptionsEditorProps> = (
    {
        options,
        updateOptions,
        className
    }
) => {
    return (
        <div className={className}>
            <div style={{display: "grid", gap: 12, paddingTop: 12, gridTemplateColumns: "auto auto"}}>
                <WktTextField
                    optionKey={'time'}
                    label={'Time (ISO-format)'}
                    options={options}
                    updateOptions={updateOptions}
                />
                <div id="spareField"/>
                <WktTextField
                    label={'Group'}
                    options={options}
                    optionKey='group'
                    updateOptions={updateOptions}
                />
                <WktTextField
                    label={'Group prefix (used as fallback)'}
                    optionKey='groupPrefix'
                    options={options}
                    updateOptions={updateOptions}
                />
                <WktTextField
                    label={'Label'}
                    optionKey='label'
                    options={options}
                    updateOptions={updateOptions}
                />
                <WktTextField
                    label={'Label prefix (used as fallback)'}
                    optionKey='labelPrefix'
                    options={options}
                    updateOptions={updateOptions}
                />
            </div>
        </div>
    );
}

export default WktOptionsEditor;
