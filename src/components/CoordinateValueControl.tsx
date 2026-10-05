/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { WithLocale } from "@/util/lang";

import { Variable } from "@/model/variable";
import TimePlayer from "@/connected/TimePlayer";
import TimeSelect from "@/connected/TimeSelect";
import TimeSlider from "@/connected/TimeSlider";
import CoordinateValuePlayer from "@/connected/CoordinateValuePlayer";
import CoordinateValueSelect from "@/connected/CoordinateValueSelect";
import CoordinateValueSlider from "@/connected/CoordinateValueSlider";
import { isSpatialDim } from "@/model/dataset";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

interface CoordinateValueControlProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  showAllDimensions: boolean;
}

export default function CoordinateValueControl({
  selectedVariable,
  selectedDimensionLabel,
  showAllDimensions,
}: CoordinateValueControlProps) {
  if (!selectedVariable) return null;

  const renderDimensionControls = (dimensionLabel: string) => {
    const isTimeDimension = dimensionLabel === "time";
    return isTimeDimension ? (
      <>
        <TimeSelect />
        <TimePlayer />
        <TimeSlider />
      </>
    ) : (
      <>
        <CoordinateValueSelect dimensionLabel={dimensionLabel} />
        <CoordinateValuePlayer dimensionLabel={dimensionLabel} />
        <CoordinateValueSlider dimensionLabel={dimensionLabel} />
      </>
    );
  };

  if (showAllDimensions) {
    const dimensionLabels =
      selectedVariable.dims?.filter((dimension) => !isSpatialDim(dimension)) ??
      [];

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
        {dimensionLabels.map((dimensionLabel, index) => (
          <Box
            key={dimensionLabel}
            sx={{ display: "flex", alignItems: "flex-start" }}
          >
            {renderDimensionControls(dimensionLabel)}

            {index < dimensionLabels.length - 1 && (
              <Divider orientation="vertical" variant="middle" flexItem />
            )}
          </Box>
        ))}
      </Box>
    );
  }

  if (!selectedDimensionLabel) return null;

  return <>{renderDimensionControls(selectedDimensionLabel)}</>;
}
