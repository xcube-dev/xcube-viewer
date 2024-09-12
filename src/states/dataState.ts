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

import { Config } from "@/config";
import { ApiServerConfig, ApiServerInfo } from "@/model/apiServer";
import { ColorBars } from "@/model/colorBar";
import { Dataset } from "@/model/dataset";
import { PlaceGroup } from "@/model/place";
import { TimeSeriesGroup } from "@/model/timeSeries";
import { loadUserServers } from "./userSettings";
import { StatisticsRecord } from "@/model/statistics";
import { ExpressionCapabilities } from "@/model/userVariable";

interface StatisticsState {
  loading: boolean;
  records: StatisticsRecord[];
}

export interface DataState {
  serverInfo: ApiServerInfo | null;
  expressionCapabilities: ExpressionCapabilities | null;
  datasets: Dataset[];
  colorBars: ColorBars | null;
  statistics: StatisticsState;
  timeSeriesGroups: TimeSeriesGroup[];
  userPlaceGroups: PlaceGroup[];
  userServers: ApiServerConfig[]; // Will contain at least 1 item
}

export function newDataState(): DataState {
  const extraUserServers = loadUserServers();
  const userServers = [{ ...Config.instance.server }];
  extraUserServers.forEach((extraUserServer) => {
    if (
      !userServers.find((userServer) => userServer.id === extraUserServer.id)
    ) {
      userServers.push(extraUserServer);
    }
  });
  return {
    serverInfo: null,
    expressionCapabilities: null,
    datasets: [],
    colorBars: null,
    statistics: { loading: false, records: [] },
    timeSeriesGroups: [],
    userPlaceGroups: [],
    userServers,
  };
}
