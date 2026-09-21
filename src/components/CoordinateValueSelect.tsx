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

import { WithLocale } from "@/util/lang";

import ControlBarItem from "./ControlBarItem";
import { Dimension } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { useEffect } from "react";
import { CoordinateValues } from "@/states/controlState";

interface CoordinateValueSelectProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  selectedDimension: Dimension | null;
  selectedCoordinateValue: number | string | null;
  selectCoordinateValues: (selectedValues: CoordinateValues) => void;
}

export default function CoordinateValueSelect({
  selectedVariable,
  selectedDimensionLabel,
  selectedDimension,
  selectedCoordinateValue,
  selectCoordinateValues,
}: CoordinateValueSelectProps) {
  //TODO: simplify is possible
  useEffect(() => {
    const hasSelectedValue =
      selectedCoordinateValue !== null &&
      selectedCoordinateValue !== undefined &&
      selectedDimension?.coordinates?.includes(Number(selectedCoordinateValue));

    if (
      selectedDimensionLabel &&
      !hasSelectedValue &&
      selectedDimension?.coordinates?.length
    ) {
      selectCoordinateValues({
        [selectedDimensionLabel]: selectedDimension.coordinates[0],
      });
    }
  }, [
    selectedCoordinateValue,
    selectedDimension,
    selectCoordinateValues,
    selectedDimensionLabel,
  ]);

  // only show component if selectedVariables has dimension
  if (
    !selectedDimensionLabel ||
    !selectedDimension ||
    selectedCoordinateValue === null ||
    selectedCoordinateValue === undefined ||
    !selectedVariable?.dims?.includes(selectedDimension.name)
  )
    return null;

  const handleValueChange = (event: SelectChangeEvent) => {
    selectCoordinateValues({ [selectedDimensionLabel]: event.target.value });
  };

  const valueSelectLabel = (
    <InputLabel shrink htmlFor="depth-select">
      {selectedDimensionLabel}
    </InputLabel>
  );

  const valueSelect = (
    <Select
      variant="standard"
      value={String(selectedCoordinateValue)}
      onChange={handleValueChange}
      input={<Input name="selectedDimension" id="value-select" />}
      displayEmpty
      name="Dimension"
      renderValue={(value) => value || "Select coordinate"}
      sx={{ width: "150px" }}
    >
      {(selectedDimension.coordinates || []).map((coordinate) => {
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
      label={valueSelectLabel}
      control={valueSelect}
      actions={[]}
    />
  );
}
