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
import TextField from '@material-ui/core/TextField';

import i18n from '../../i18n';
import { CsvOptions } from '../../model/user-place/csv';


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
    function handleLabelPropertyNameChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        updateOptions({labelName: e.target.value});
    }

    function handleFallbackNamePrefixChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        updateOptions({labelPrefix: e.target.value});
    }

    return (
            <div className={className}>
                <TextField
                        label={i18n.get('Label name')}
                        value={options.labelName}
                        onChange={handleLabelPropertyNameChange}
                        size="small"
                        variant="standard"
                        style={{flexGrow: 1, marginRight: 10}}
                />
                <TextField
                        label={i18n.get('Label prefix (used as fallback)')}
                        value={options.labelPrefix}
                        onChange={handleFallbackNamePrefixChange}
                        size="small"
                        variant="standard"
                        style={{flexGrow: 1}}
                />
            </div>
    );
}

export default CsvOptionsEditor;