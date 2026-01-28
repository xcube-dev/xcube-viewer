/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useState, SyntheticEvent, useEffect, useMemo } from "react";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";

import { getLabelsForValues, getLabelForValue } from "@/util/label";
import { ColorBarNorm } from "@/model/variable";
import Scaling from "./scaling";

interface ColorBarRangeSliderProps {
  variableColorBarName: string;
  variableColorBarMinMax: [number, number];
  variableColorBarNorm: ColorBarNorm;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarName: string,
    colorBarMinMax: [number, number],
    colorBarNorm: ColorBarNorm,
    opacity: number,
  ) => void;
  originalColorBarMinMax: [number, number];
}

export default function ColorBarRangeSlider({
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableOpacity,
  updateVariableColorBar,
  originalColorBarMinMax,
}: ColorBarRangeSliderProps) {
  const scaling = useMemo(
    () => new Scaling(variableColorBarNorm === "log"),
    [variableColorBarNorm],
  );

  const [currentMinMax, setCurrentMinMax] = useState<[number, number]>(() =>
    scaling.scale(variableColorBarMinMax),
  );

  useEffect(() => {
    setCurrentMinMax(scaling.scale(variableColorBarMinMax));
  }, [scaling, variableColorBarMinMax]);

  const handleMinMaxChange = (_event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setCurrentMinMax(value as [number, number]);
    }
  };

  const handleMinMaxChangeCommitted = (
    _event: Event | SyntheticEvent,
    value: number | number[],
  ) => {
    if (Array.isArray(value)) {
      // Here we convert to the precision of the displayed labels.
      // Otherwise, we'd get a lot of confusing digits if log-scaled.
      const minMaxLabels = getLabelsForValues(scaling.scaleInv(value));
      const minMaxValues = minMaxLabels.map((label) =>
        Number.parseFloat(label),
      );
      updateVariableColorBar(
        variableColorBarName,
        minMaxValues as [number, number],
        variableColorBarNorm,
        variableOpacity,
      );
    }
  };

  const [original1, original2] = scaling.scale(originalColorBarMinMax);
  const dist = original1 < original2 ? original2 - original1 : 1;
  const distExp = Math.floor(Math.log10(dist));
  const distNorm = dist * Math.pow(10, -distExp);

  let numStepsInner = null;
  for (const delta of [0.25, 0.2, 0.15, 0.125, 0.1]) {
    const numStepsFloat = distNorm / delta;
    const numStepsInt = Math.floor(numStepsFloat);
    if (Math.abs(numStepsInt - numStepsFloat) < 1e-10) {
      numStepsInner = numStepsInt;
      break;
    }
  }

  let numStepsOuter;
  if (numStepsInner !== null && numStepsInner >= 2) {
    numStepsOuter = Math.max(2, Math.round(numStepsInner / 2));
  } else {
    numStepsOuter = 4;
    numStepsInner = 8;
  }

  const delta = original1 < original2 ? dist / numStepsInner : 0.5;
  const numSteps = numStepsInner + 2 * numStepsOuter;
  const total1 = original1 - numStepsOuter * delta;
  const total2 = original2 + numStepsOuter * delta;
  const step = (total2 - total1) / numSteps;
  const values = [total1, original1, original2, total2];
  const marks: Mark[] = getLabelsForValues(scaling.scaleInv(values)).map(
    (label, i) => {
      return { value: values[i], label };
    },
  );

  return (
    <Slider
      min={total1}
      max={total2}
      value={currentMinMax}
      marks={marks}
      step={step}
      valueLabelFormat={(v) => getLabelForValue(scaling.scaleInv(v))}
      onChange={handleMinMaxChange}
      onChangeCommitted={handleMinMaxChangeCommitted}
      valueLabelDisplay="auto"
      size="small"
    />
  );
}
