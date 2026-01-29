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
  depth: Dimension | null;
  selectedDepthCoordinate: number | string | null;
  selectDepthCoordinate: (
    selectedDepthCoordinate: number | string | null,
  ) => void;
}

export default function DepthSelect({
  selectedVariable,
  depth,
  selectedDepthCoordinate,
  selectDepthCoordinate,
}: DepthSelectProps) {
  useEffect(() => {
    if (!selectedDepthCoordinate && depth?.coordinates?.length) {
      selectDepthCoordinate(depth.coordinates[0]);
    }
  }, [selectedDepthCoordinate, depth, selectDepthCoordinate]);

  // only show DepthSelect if selectedVariables has depth dim
  // and selectedDepthCoordinate
  if (
    !depth ||
    !selectedVariable?.dims?.includes(depth.name) ||
    !selectedDepthCoordinate
  )
    return null;

  const handleDepthChange = (event: SelectChangeEvent) => {
    selectDepthCoordinate(Number(event.target.value));
  };

  const depthSelectLabel = (
    <InputLabel shrink htmlFor="depth-select">
      {i18n.get("Depth")}{" "}
      {depth?.name
        ? `(${depth.name.charAt(0).toUpperCase() + depth.name.slice(1)})`
        : ""}
    </InputLabel>
  );

  const depthSelect = (
    <Select
      variant="standard"
      value={
        String(selectedDepthCoordinate) //|| String(depth.coordinates[0]) || ""
      }
      onChange={handleDepthChange}
      input={<Input name="depthDimension" id="depth-select" />}
      displayEmpty
      name="depthDimension"
      renderValue={(value) => value || "Select coordinate"}
    >
      {(depth.coordinates || []).map((coordinate) => {
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
