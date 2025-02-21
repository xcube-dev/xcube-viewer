/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { styled } from "@mui/system";

import { WktOptions } from "@/model/user-place/wkt";
import OptionsField from "./OptionsTextField";

const WktTextField = OptionsField<WktOptions, string>();

const StyledDiv = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

interface WktOptionsEditorProps {
  options: WktOptions;
  updateOptions: (options: Partial<WktOptions>) => void;
}

const WktOptionsEditor: React.FC<WktOptionsEditorProps> = ({
  options,
  updateOptions,
}) => {
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
        <WktTextField
          optionKey={"time"}
          label={"Time (UTC, ISO-format)"}
          options={options}
          updateOptions={updateOptions}
        />
        <div id="spareField" />
        <WktTextField
          label={"Group"}
          options={options}
          optionKey="group"
          updateOptions={updateOptions}
        />
        <WktTextField
          label={"Group prefix (used as fallback)"}
          optionKey="groupPrefix"
          options={options}
          updateOptions={updateOptions}
          disabled={options.group.trim() !== ""}
        />
        <WktTextField
          label={"Label"}
          optionKey="label"
          options={options}
          updateOptions={updateOptions}
        />
        <WktTextField
          label={"Label prefix (used as fallback)"}
          optionKey="labelPrefix"
          options={options}
          updateOptions={updateOptions}
          disabled={options.label.trim() !== ""}
        />
      </div>
    </StyledDiv>
  );
};

export default WktOptionsEditor;
