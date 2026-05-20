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
import { Variable } from "@/model/variable";
import { useEffect } from "react";
import i18n from "@/i18n";

interface DimensionsSelectProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  selectDimension: (selectedDimension: string | null) => void;
}

export default function DimensionSelect({
  selectedVariable,
  selectedDimensionLabel,
  selectDimension,
}: DimensionsSelectProps) {
  useEffect(() => {
    const nonSpatialDims =
      selectedVariable?.dims?.filter(
        (dim) =>
          !["lat", "lon", "latitude", "longitude", "x", "y"].includes(dim),
      ) ?? [];

    const hasSelectedDimension =
      selectedDimensionLabel != null &&
      nonSpatialDims.includes(selectedDimensionLabel);

    if (nonSpatialDims.length && !hasSelectedDimension) {
      selectDimension(nonSpatialDims[0]);
    }
  }, [selectedVariable, selectedDimensionLabel, selectDimension]);

  // only show DepthSelect if selectedVariables has depth dim
  // and selectedDimensionValue
  if (!selectedVariable || !selectedDimensionLabel) return null;

  console.log("selectedDimensionLabel", selectedDimensionLabel);
  console.log("selectedVariable", selectedVariable);
  const handleDimensionChange = (event: SelectChangeEvent) => {
    selectDimension(String(event.target.value));
  };

  //TODO: add to lang.json
  const dimensionSelectLabel = (
    <InputLabel shrink htmlFor="dimension-select">
      {i18n.get("Dimension")}
    </InputLabel>
  );

  const nonSpatialDims =
    selectedVariable?.dims?.filter(
      (dim) => !["lat", "lon", "x", "y"].includes(dim),
    ) ?? [];

  //TODO: ducplication
  const hasSelectedDimension = selectedVariable?.dims?.includes(
    selectedDimensionLabel,
  );

  const dimensionSelectValue = hasSelectedDimension
    ? selectedDimensionLabel
    : "";

  const dimensionSelect = (
    <Select
      variant="standard"
      value={dimensionSelectValue}
      onChange={handleDimensionChange}
      input={<Input name="selectedDimension" id="dimension-select" />}
      displayEmpty
      name="selectedDimension"
      renderValue={(value) => value || "Select dimension"}
      /*      sx={{ width: "150px" }}*/
    >
      {nonSpatialDims.map((values) => {
        return (
          <MenuItem key={values} value={values}>
            <ListItemText primary={values} />
          </MenuItem>
        );
      })}
    </Select>
  );

  return (
    <ControlBarItem
      label={dimensionSelectLabel}
      control={dimensionSelect}
      actions={[]}
    />
  );
}
