/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { styled } from "@mui/system";

import { GeoJsonOptions } from "@/model/user-place/geojson";
import OptionsField from "./OptionsTextField";

const GeoJsonTextField = OptionsField<GeoJsonOptions, string>();

interface GeoJsonOptionsEditorProps {
  options: GeoJsonOptions;
  updateOptions: (options: Partial<GeoJsonOptions>) => void;
}

const StyledDiv = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const GeoJsonOptionsEditor: React.FC<GeoJsonOptionsEditorProps> = ({
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
        <GeoJsonTextField
          optionKey={"timeNames"}
          label={"Time property names"}
          options={options}
          updateOptions={updateOptions}
        />
        <div id="spareField" />
        <GeoJsonTextField
          label={"Group property names"}
          optionKey="groupNames"
          options={options}
          updateOptions={updateOptions}
        />
        <GeoJsonTextField
          label={"Group prefix (used as fallback)"}
          optionKey="groupPrefix"
          options={options}
          updateOptions={updateOptions}
        />
        <GeoJsonTextField
          label={"Label property names"}
          optionKey="labelNames"
          options={options}
          updateOptions={updateOptions}
        />
        <GeoJsonTextField
          label={"Label prefix (used as fallback)"}
          optionKey="labelPrefix"
          options={options}
          updateOptions={updateOptions}
        />
      </div>
    </StyledDiv>
  );
};

export default GeoJsonOptionsEditor;
