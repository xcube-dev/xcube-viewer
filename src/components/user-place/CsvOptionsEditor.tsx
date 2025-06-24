/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/system";

import { CsvOptions } from "@/model/user-place/csv";
import OptionsTextField from "./OptionsTextField";

const CsvTextField = OptionsTextField<CsvOptions, string>();

interface CsvOptionsEditorProps {
  options: CsvOptions;
  updateOptions: (options: Partial<CsvOptions>) => unknown;
}

const StyledDiv = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const CsvOptionsEditor: React.FC<CsvOptionsEditorProps> = ({
  options,
  updateOptions,
}) => {
  const forceGeometry = options.forceGeometry;
  return (
    <StyledDiv>
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
    </StyledDiv>
  );
};

export default CsvOptionsEditor;
