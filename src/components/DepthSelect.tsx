/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";

import ControlBarItem from "./ControlBarItem";
import { Dimension } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { useEffect } from "react";

interface DepthSelectProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDepthDimension: Dimension | null;
  selectedDepth: number | string | null;
  selectDepth: (selectedDepth: number | string | null) => void;
}

export default function DepthSelect({
  selectedVariable,
  selectedDepthDimension,
  selectedDepth,
  selectDepth,
}: DepthSelectProps) {
  useEffect(() => {
    if (!selectedDepth && selectedDepthDimension?.coordinates?.length) {
      selectDepth(selectedDepthDimension.coordinates[0]);
    }
  }, [selectedDepth, selectedDepthDimension, selectDepth]);

  // only show DepthSelect if selectedVariables has depth dim
  // and selectedDepth
  if (
    !selectedDepthDimension ||
    !selectedVariable?.dims?.includes(selectedDepthDimension.name) ||
    !selectedDepth
  )
    return null;

  const handleDepthChange = (event: SelectChangeEvent) => {
    selectDepth(Number(event.target.value));
  };

  const depthSelectLabel = (
    <InputLabel shrink htmlFor="depth-select">
      {i18n.get("Depth")}{" "}
      {selectedDepthDimension?.name
        ? `(${selectedDepthDimension.name.charAt(0).toUpperCase() + selectedDepthDimension.name.slice(1)})`
        : ""}
    </InputLabel>
  );

  const depthSelect = (
    <Select
      /*      autoWidth={false}*/
      variant="standard"
      value={
        String(selectedDepth) //|| String(depth.coordinates[0]) || ""
      }
      onChange={handleDepthChange}
      input={<Input name="depthDimension" id="depth-select" />}
      displayEmpty
      name="depthDimension"
      renderValue={(value) => value || "Select coordinate"}
      sx={{ width: "150px" }}
    >
      {(selectedDepthDimension.coordinates || []).map((coordinate) => {
        return (
          <MenuItem key={coordinate} value={coordinate}>
            <ListItemText primary={coordinate} />
          </MenuItem>
        );
      })}
    </Select>
  );

  return (
    <ControlBarItem
      label={depthSelectLabel}
      control={depthSelect}
      actions={[]}
    />
  );
}
