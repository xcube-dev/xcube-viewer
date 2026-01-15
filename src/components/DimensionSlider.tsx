/*
 * Copyright (c) 2019-2025 by xcube team and contributors
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
import { UNIT } from "@/model/timeSeries";

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  box: {
    marginLeft: HOR_MARGIN,
    marginRight: HOR_MARGIN,
    minWidth: "10rem",
    height: "3rem",
    //  marginTop: "1rem",
  },
});

interface DimensionSliderProps {
  hasDimension?: boolean;
  dimension: Dimension | null;
  selectedDimensionCoordinate: string | null;
  selectDimensionCoordinate: (
    selectedDimensionCoordinate: string | null,
  ) => void;
  /*
  selectedTimeRange?: TimeRange | null;
  selectTimeRange?: (timeRange: TimeRange | null) => void;*/
}

export default function DimensionSliderProps({
  hasDimension,
  dimension,
  selectedDimensionCoordinate,
  selectDimensionCoordinate /*  hasTimeDimension,
  selectedTimeRange,*/,
}: DimensionSliderProps) {
  const [selectedDimension_, setSelectedDimension_] = useState(
    Number(selectedDimensionCoordinate),
  );

  let selectedDimensionCoordinates = dimension?.coordinates;

  console.log("selectedDimensionCoordinates", selectedDimensionCoordinates);

  useEffect(() => {
    setSelectedDimension_(
      selectedDimensionCoordinate != null
        ? Number(selectedDimensionCoordinate)
        : (selectedDimensionCoordinates?.[0] ?? 0),
    );
  }, [selectedDimensionCoordinate, selectedDimensionCoordinates]);

  if (!hasDimension) {
    return null;
  }

  const handleChange = (_event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setSelectedDimension_(value);
    }
  };

  const handleChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    value: number | number[],
  ) => {
    if (selectDimensionCoordinate && typeof value === "number") {
      selectDimensionCoordinate(String(value));
    }
  };

  function valueLabelFormat(value: number) {
    return String(value.toFixed(2));
  }

  const selectedDimensionRangeValid = Array.isArray(
    selectedDimensionCoordinates,
  );
  if (!selectedDimensionRangeValid) {
    selectedDimensionCoordinates = [0, 1];
  }

  const min = selectedDimensionCoordinates[0];
  const max =
    selectedDimensionCoordinates[selectedDimensionCoordinates.length - 1];
  // only labels for the min and max values
  const marks: Mark[] = selectedDimensionCoordinates.map((value, index) => ({
    value,
    label:
      index === 0 || index === selectedDimensionCoordinates.length - 1
        ? value.toFixed(2)
        : undefined,
  }));

  console.log(marks);
  return (
    <Box sx={styles.box}>
      <Tooltip arrow title={i18n.get("Select DEPTH in dataset")}>
        <Slider
          disabled={!selectedDimensionRangeValid}
          min={min}
          max={max}
          value={selectedDimension_} // || 0}
          /*valueLabelDisplay="off"*/
          valueLabelDisplay="auto" //"on"
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
