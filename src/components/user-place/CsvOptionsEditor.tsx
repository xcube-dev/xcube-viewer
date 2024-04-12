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

import * as React from "react";
import Checkbox from "@mui/material/Checkbox";

import { CsvOptions } from "../../model/user-place/csv";
import OptionsTextField from "./OptionsTextField";

const CsvTextField = OptionsTextField<CsvOptions, string>();

interface CsvOptionsEditorProps {
  options: CsvOptions;
  updateOptions: (options: Partial<CsvOptions>) => unknown;
  className: string;
}

const CsvOptionsEditor: React.FC<CsvOptionsEditorProps> = ({
  options,
  updateOptions,
  className,
}) => {
  const forceGeometry = options.forceGeometry;
  return (
    <div className={className}>
      <div
        style={{
          display: "grid",
          gap: 12,
          paddingTop: 12,
          gridTemplateColumns: "auto auto",
        }}
      >
        <CsvTextField
          optionKey={"xNames"}
          label={"X/longitude column names"}
          options={options}
          updateOptions={updateOptions}
          disabled={forceGeometry}
        />
        <CsvTextField
          optionKey={"yNames"}
          label={"Y/latitude column names"}
          options={options}
          updateOptions={updateOptions}
          disabled={forceGeometry}
        />
        <span>
          <Checkbox
            checked={options.forceGeometry}
            onChange={(e) => updateOptions({ forceGeometry: e.target.checked })}
            size="small"
          />
          <span>{"Use geometry column"}</span>
        </span>
        <CsvTextField
          optionKey={"geometryNames"}
          label={"Geometry column names"}
          options={options}
          updateOptions={updateOptions}
          disabled={!forceGeometry}
        />
        <CsvTextField
          optionKey={"timeNames"}
          label={"Time column names"}
          options={options}
          updateOptions={updateOptions}
        />
        <div id="spareField" />
        <CsvTextField
          optionKey={"groupNames"}
          label={"Group column names"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"groupPrefix"}
          label={"Group prefix (used as fallback)"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"labelNames"}
          label={"Label column names"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"labelPrefix"}
          label={"Label prefix (used as fallback)"}
          options={options}
          updateOptions={updateOptions}
        />
      </div>
      <div
        style={{
          display: "grid",
          gap: 12,
          paddingTop: 12,
          gridTemplateColumns: "auto auto auto",
        }}
      >
        <CsvTextField
          optionKey={"separator"}
          label={"Separator character"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"comment"}
          label={"Comment character"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"quote"}
          label={"Quote character"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"escape"}
          label={"Escape character"}
          options={options}
          updateOptions={updateOptions}
        />
        <div />
        <span>
          <Checkbox
            checked={options.trim}
            onChange={(e) => updateOptions({ trim: e.target.checked })}
            size="small"
          />
          <span>Remove whitespaces</span>
        </span>
        <CsvTextField
          optionKey={"nanToken"}
          label={"Not-a-number token"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"trueToken"}
          label={"True token"}
          options={options}
          updateOptions={updateOptions}
        />
        <CsvTextField
          optionKey={"falseToken"}
          label={"False token"}
          options={options}
          updateOptions={updateOptions}
        />
      </div>
    </div>
  );
};

export default CsvOptionsEditor;
