/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
