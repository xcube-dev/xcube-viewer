/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining x copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { useState, SyntheticEvent } from "react";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";

import { getLabelsForValues, getLabelForValue } from "@/util/label";
import { ColorBarNorm } from "@/model/variable";

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
  const norm = new Norm(variableColorBarNorm === "log");

  const [currentMinMax, setCurrentMinMax] = useState<[number, number]>(() =>
    norm.scale(variableColorBarMinMax),
  );

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
      const minMaxLabels = getLabelsForValues(norm.scaleInv(value));
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

  const [original1, original2] = norm.scale(originalColorBarMinMax);
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

  const marks: Mark[] = getLabelsForValues(norm.scaleInv(values)).map(
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
      valueLabelFormat={(v) => getLabelForValue(norm.scaleInv(v))}
      onChange={handleMinMaxChange}
      onChangeCommitted={handleMinMaxChangeCommitted}
      valueLabelDisplay="auto"
      size="small"
    />
  );
}

// noinspection JSUnusedGlobalSymbols
class Norm {
  readonly isLog: boolean;

  constructor(isLog: boolean) {
    this.isLog = isLog;
  }

  scale(x: number): number;
  scale(x: [number, number]): [number, number];
  scale(x: number[]): number[];
  scale(
    x: number | [number, number] | number[],
  ): number | [number, number] | number[] {
    if (!this.isLog) {
      return x;
    }
    return typeof x === "number" ? Math.log10(x) : x.map((v) => Math.log10(v));
  }

  scaleInv(x: number): number;
  scaleInv(x: [number, number]): [number, number];
  scaleInv(x: number[]): number[];
  scaleInv(
    x: number | [number, number] | number[],
  ): number | [number, number] | number[] {
    if (!this.isLog) {
      return x;
    }
    return typeof x === "number"
      ? Math.pow(10, x)
      : x.map((v) => Math.pow(10, v));
  }
}
