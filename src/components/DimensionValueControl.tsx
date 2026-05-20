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

interface DimensionsValueControlProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
}

export default function DimensionValueControl({
  selectedVariable,
  selectedDimensionLabel,
}: DimensionsValueControlProps) {
  if (!selectedVariable || !selectedDimensionLabel) return null;

  const isTimeDimension = selectedDimensionLabel === "time";

  return (
    <>
      {isTimeDimension ? (
        <>
          <TimeSelect />
          <TimePlayer />
          <TimeSlider />
        </>
      ) : (
        <>
          <DimensionValueSelect />
          <DimensionValuePlayer />
          <DimensionValueSlider />
        </>
      )}
    </>
  );
}
