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

interface DepthSliderProps {
  selectedVariable: Variable | null;
  selectedDepthDimension: Dimension | null;
  selectedDepth: number | string | null;
  selectDepth: (selectedDepth: number | string | null) => void;
}

export default function DepthSliderProps({
  selectedVariable,
  selectedDepthDimension,
  selectedDepth,
  selectDepth,
}: DepthSliderProps) {
  const [selectedDepth_, setSelectedDepth_] = useState(selectedDepth);

  useEffect(() => {
    setSelectedDepth_(
      selectedDepth ||
        (selectedDepthDimension?.coordinates
          ? selectedDepthDimension.coordinates[0]
          : 0),
    );
  }, [selectedDepth, selectedDepthDimension]);

  // only show DepthSelect if selectedVariables has depth dim
  // and selectedDepth
  if (
    !selectedDepthDimension ||
    !selectedVariable?.dims?.includes(selectedDepthDimension.name) ||
    !selectedDepth
  )
    return null;

  //TODO use selector selectedDatasetDepthCoordiantes ...
  let selectedDepthCoordinates = selectedDepthDimension.coordinates;

  const handleChange = (_event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setSelectedDepth_(value);
    }
  };

  const handleChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    value: number | number[],
  ) => {
    if (selectDepth && typeof value === "number") {
      selectDepth(value as number);
    }
  };

  function valueLabelFormat(value: number) {
    return String(value.toFixed(2));
  }

  const selectedDepthRangeValid = Array.isArray(selectedDepthCoordinates);
  if (!selectedDepthRangeValid) {
    selectedDepthCoordinates = [0, 1];
  }

  const min = selectedDepthCoordinates[0];
  const max = selectedDepthCoordinates[selectedDepthCoordinates.length - 1];
  // only labels for the min and max values
  const marks: Mark[] = selectedDepthCoordinates.map((value, index) => ({
    value,
    label:
      index === 0 || index === selectedDepthCoordinates.length - 1
        ? value.toFixed(2)
        : undefined,
  }));

  return (
    <Box sx={styles.box}>
      <Tooltip arrow title={i18n.get("Select depth")}>
        <Slider
          disabled={!selectedDepthRangeValid}
          min={min}
          max={max}
          value={Number(selectedDepth_)} // || 0}
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
