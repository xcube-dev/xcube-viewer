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
import { DimensionValues } from "@/states/controlState";

interface DimensionValueSelectProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  selectedDimension: Dimension | null;
  selectedDimensionValue: number | string | null;
  selectDimensionValues: (selectedValues: DimensionValues) => void;
}

export default function DimensionValueSelect({
  selectedVariable,
  selectedDimensionLabel,
  selectedDimension,
  selectedDimensionValue,
  selectDimensionValues,
}: DimensionValueSelectProps) {
  //TODO: simplify is possible
  useEffect(() => {
    const hasSelectedValue =
      selectedDimensionValue !== null &&
      selectedDimensionValue !== undefined &&
      selectedDimension?.coordinates?.includes(Number(selectedDimensionValue));

    if (
      selectedDimensionLabel &&
      !hasSelectedValue &&
      selectedDimension?.coordinates?.length
    ) {
      selectDimensionValues({
        [selectedDimensionLabel]: selectedDimension.coordinates[0],
      });
    }
  }, [
    selectedDimensionValue,
    selectedDimension,
    selectDimensionValues,
    selectedDimensionLabel,
  ]);

  // only show component if selectedVariables has dimension
  if (
    !selectedDimensionLabel ||
    !selectedDimension ||
    selectedDimensionValue === null ||
    selectedDimensionValue === undefined ||
    !selectedVariable?.dims?.includes(selectedDimension.name)
  )
    return null;

  const handleValueChange = (event: SelectChangeEvent) => {
    selectDimensionValues({ [selectedDimensionLabel]: event.target.value });
  };

  const valueSelectLabel = (
    <InputLabel shrink htmlFor="depth-select">
      {selectedDimensionLabel}
    </InputLabel>
  );

  const valueSelect = (
    <Select
      variant="standard"
      value={String(selectedDimensionValue)}
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
