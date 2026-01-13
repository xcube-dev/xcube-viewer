/*
 * Copyright (c) 2019-2025 by xcube team and contributors
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

interface DimensionSelectProps extends WithLocale {
  dimension: Dimension | null;
  selectedDimensionCoordinate: string | null;
  selectDimensionCoordinate: (
    selectedDimensionCoordinate: string | null,
  ) => void;
}

export default function DimensionSelect({
  dimension,
  selectedDimensionCoordinate,
  selectDimensionCoordinate,
}: DimensionSelectProps) {
  if (!dimension) return null;

  const handleDimensionChange = (event: SelectChangeEvent) => {
    selectDimensionCoordinate(event.target.value || null);
  };

  if (!selectedDimensionCoordinate) {
    selectDimensionCoordinate(String(dimension.coordinates[0]));
  }

  const dimensionSelectLabel = (
    <InputLabel shrink htmlFor="dimension-select">
      {i18n.get("Dimension")}{" "}
      {dimension?.name
        ? `(${dimension.name.charAt(0).toUpperCase() + dimension.name.slice(1)})`
        : ""}
    </InputLabel>
  );

  const dimensionSelect = (
    <Select
      variant="standard"
      value={
        selectedDimensionCoordinate || String(dimension.coordinates[0]) || ""
      }
      onChange={handleDimensionChange}
      input={<Input name="dimennsion" id="dimension-select" />}
      displayEmpty
      name="imension"
      renderValue={(value) => value || "Select coordinate"}
    >
      {(dimension.coordinates || []).map((coordinate) => {
        const coordinateString = String(coordinate);

        return (
          <MenuItem key={coordinateString} value={coordinateString}>
            <ListItemText primary={coordinateString} />
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
