/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";
import Tooltip from "@mui/material/Tooltip";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { Dimension } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { CoordinateValues } from "@/states/controlState";

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  box: {
    marginLeft: HOR_MARGIN,
    marginRight: HOR_MARGIN,
    minWidth: "10rem",
    height: "3rem",
  },
});

interface CoordinateValueSliderProps {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  selectedDimension: Dimension | null;
  selectedCoordinateValue: number | string | null;
  selectCoordinateValues: (selectedValues: CoordinateValues) => void;
}

export default function CoordinateValueSliderProps({
  selectedVariable,
  selectedDimensionLabel,
  selectedDimension,
  selectedCoordinateValue,
  selectCoordinateValues,
}: CoordinateValueSliderProps) {
  const [selectedCoordinateValue_, setSelectedCoordinateValue_] = useState(
    selectedCoordinateValue,
  );

  useEffect(() => {
    setSelectedCoordinateValue_(
      selectedCoordinateValue ??
        (selectedDimension?.coordinates ? selectedDimension.coordinates[0] : 0),
    );
  }, [selectedCoordinateValue, selectedDimension]);

  // only show DepthSelect if selectedVariables has depth dim
  // and selectedCoordinateValue
  if (
    !selectedDimension ||
    !selectedVariable?.dims?.includes(selectedDimension.name) ||
    selectedCoordinateValue === null ||
    selectedCoordinateValue === undefined
  )
    return null;

  let selectedCoordinates = selectedDimension.coordinates;

  const handleChange = (_event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setSelectedCoordinateValue_(value);
    }
  };

  const handleChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    value: number | number[],
  ) => {
    if (
      selectedDimensionLabel !== null &&
      selectCoordinateValues &&
      typeof value === "number"
    ) {
      selectCoordinateValues({ [selectedDimensionLabel]: value as number });
    }
  };

  function valueLabelFormat(value: number) {
    return String(value.toFixed(2));
  }

  const selectedDepthRangeValid =
    Array.isArray(selectedCoordinates) && selectedCoordinates.length > 0;
  if (!selectedDepthRangeValid) {
    selectedCoordinates = [0, 1];
  }

  const min = Math.min(...selectedCoordinates);
  const max = Math.max(...selectedCoordinates);
  // only labels for the min and max values
  const marks: Mark[] = selectedCoordinates.map((value, index) => ({
    value,
    label:
      index === 0 || index === selectedCoordinates.length - 1
        ? value.toFixed(2)
        : undefined,
  }));

  return (
    <Box sx={styles.box}>
      <Tooltip arrow title={i18n.get("Select value in dimension")}>
        <Slider
          disabled={!selectedDepthRangeValid}
          min={min}
          max={max}
          value={Number(selectedCoordinateValue_)} // || 0}
          valueLabelDisplay="off" // "auto" //"on"
          valueLabelFormat={valueLabelFormat}
          marks={marks}
          step={null}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          size="small"
          //  orientation="horizontal"
        />
      </Tooltip>
    </Box>
  );
}
