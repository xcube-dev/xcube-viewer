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
import { Dimension, isSpatialDim } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { useEffect } from "react";
import i18n from "@/i18n";

interface DimensionSelectProps extends WithLocale {
  dimensions: Dimension[];
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  showAllDimensions: boolean;
  selectDimension: (selectedDimensionLabel: string | null) => void;
}

export default function DimensionSelect({
  dimensions,
  selectedVariable,
  selectedDimensionLabel,
  showAllDimensions,
  selectDimension,
}: DimensionSelectProps) {
  useEffect(() => {
    const nonSpatialDims =
      selectedVariable?.dims?.filter((dim) => !isSpatialDim(dim)) ?? [];

    const hasSelectedDimension =
      selectedDimensionLabel != null &&
      nonSpatialDims.includes(selectedDimensionLabel);

    if (nonSpatialDims.length && !hasSelectedDimension) {
      selectDimension(nonSpatialDims[0]);
    }
  }, [selectedVariable, selectedDimensionLabel, selectDimension]);

  if (!selectedVariable || !selectedDimensionLabel || showAllDimensions)
    return null;

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
    selectedVariable?.dims?.filter((dim) => !isSpatialDim(dim)) ?? [];

  const getDimensionLabel = (dimensionName: string) =>
    dimensions.find((dimension) => dimension.name === dimensionName)?.title ||
    dimensionName;

  if (nonSpatialDims.length <= 1) {
    return null;
  }

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
      renderValue={(value) =>
        value ? getDimensionLabel(value) : "Select dimension"
      }
    >
      {nonSpatialDims.map((values) => {
        return (
          <MenuItem key={values} value={values}>
            <ListItemText primary={getDimensionLabel(values)} />
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
