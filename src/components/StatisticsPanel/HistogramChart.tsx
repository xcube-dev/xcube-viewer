/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
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

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { AreaStatistics, StatisticsRecord } from "@/model/statistics";
import { getLabelForValue } from "@/util/label";
import { isNumber } from "@/util/types";

interface HistogramChartProps {
  statisticsRecord: StatisticsRecord;
  showBrush?: boolean;
  showDetails?: boolean;
}

export default function HistogramChart({
  statisticsRecord,
  showBrush,
  showDetails,
}: HistogramChartProps) {
  const statistics = statisticsRecord.statistics as AreaStatistics;
  const data = useMemo(() => {
    if (!statistics.histogram) {
      return null;
    }
    const { values, edges } = statistics.histogram;
    return values.map((v, i) => ({
      x: 0.5 * (edges[i] + edges[i + 1]),
      y: v,
      i,
    }));
  }, [statistics]);
  const [index, setIndex] = useState([0, data ? data.length - 1 : -1] as [
    number,
    number,
  ]);
  if (data === null) {
    return null;
  }
  const { placeInfo } = statisticsRecord.source;
  const [iDomain1, iDomain2] = index;
  // TODO: this is correct, but requires that we draw bars per bin
  // const { edges } = statistics.histogram;
  // const domain = [edges[i1], edges[i2 + 1]];
  const xDomain1 = data[iDomain1].x;
  const xDomain2 = data[iDomain2].x;
  const xRef1 = Math.max(
    statistics.mean - statistics.deviation,
    statistics.minimum,
    xDomain1,
  );
  const xRef2 = Math.min(
    statistics.mean + statistics.deviation,
    statistics.maximum,
    xDomain2,
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 0,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type={"number"}
          //type={showDetails ? "number" : "category"}
          dataKey="x"
          domain={[xDomain1, xDomain2]}
          tickCount={10}
          tickFormatter={(v) => getLabelForValue(v, 2)}
        />
        <YAxis />
        <Area
          type="monotone"
          dataKey="y"
          stroke={placeInfo.color}
          fill={placeInfo.color}
        />
        {showDetails && (
          <ReferenceLine
            x={statistics.mean}
            isFront={true}
            stroke={placeInfo.color}
            strokeWidth={1.5}
          />
        )}
        {showDetails && (
          <ReferenceArea
            x1={xRef1}
            x2={xRef2}
            isFront={false}
            stroke={placeInfo.color}
            strokeWidth={1.5}
            strokeOpacity={0.2}
            fillOpacity={0.2}
          />
        )}
        {showBrush && (
          <Brush
            dataKey={"i"}
            height={22}
            startIndex={iDomain1}
            endIndex={iDomain2}
            tickFormatter={(v) => getLabelForValue(data[v].x, 1)}
            onChange={({ startIndex, endIndex }) => {
              if (isNumber(startIndex) && isNumber(endIndex)) {
                setIndex([startIndex, endIndex]);
              }
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
