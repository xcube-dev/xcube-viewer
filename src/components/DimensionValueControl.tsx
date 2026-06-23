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
import DimensionValuePlayer from "@/connected/DimensionValuePlayer";
import DimensionValueSelect from "@/connected/DimensionValueSelect";
import DimensionValueSlider from "@/connected/DimensionValueSlider";
import { isSpatialDim } from "@/model/dataset";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

interface DimensionsValueControlProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  showAllDimensions: boolean;
}

export default function DimensionValueControl({
  selectedVariable,
  selectedDimensionLabel,
  showAllDimensions,
}: DimensionsValueControlProps) {
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
        <DimensionValueSelect dimensionLabel={dimensionLabel} />
        <DimensionValuePlayer dimensionLabel={dimensionLabel} />
        <DimensionValueSlider dimensionLabel={dimensionLabel} />
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
