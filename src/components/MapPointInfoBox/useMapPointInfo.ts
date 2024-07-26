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

import { useCallback, useEffect, useState } from "react";
import { default as OlMap } from "ol/Map";
import { default as OlMapBrowserEvent } from "ol/MapBrowserEvent";
import { transform as olTransform } from "ol/proj";

import { throttle } from "@/util/throttle";
import { getPointValue } from "@/api";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { MAP_OBJECTS } from "@/states/controlState";
import MapPointInfo from "./MapPointInfo";

const getPointValueThrottled = throttle(getPointValue, 500);

export default function useMapPointInfo(
  enabled: boolean,
  serverUrl: string,
  dataset: Dataset | null,
  variable: Variable | null,
  time: string | null,
): MapPointInfo | null {
  const [mapPointInfo, setMapPointInfo] = useState<MapPointInfo | null>(null);

  const updateCoordinateDisplay = useCallback(
    (event: OlMapBrowserEvent<PointerEvent>) => {
      const map = event.map;
      if (!enabled || !dataset || !variable || !map) {
        setMapPointInfo(null);
        return;
      }
      const geoCoordinate = olTransform(
        event.coordinate,
        map.getView().getProjection().getCode(),
        "EPSG:4326",
      );
      const newMapPointerInfo: MapPointInfo = {
        dataset,
        variable,
        pixelX: event.pixel[0],
        pixelY: event.pixel[1],
        lon: geoCoordinate[0],
        lat: geoCoordinate[1],
        time: time || undefined,
        valueState: { fetching: true },
      };
      setMapPointInfo(newMapPointerInfo);
      getPointValueThrottled(
        serverUrl,
        dataset,
        variable,
        newMapPointerInfo.lon,
        newMapPointerInfo.lat,
        time,
        null,
      )
        .then((result) => {
          setMapPointInfo(
            enabled
              ? {
                  ...newMapPointerInfo,
                  valueState: { value: result.value },
                }
              : null,
          );
        })
        .catch((error: Error) => {
          setMapPointInfo(
            enabled
              ? {
                  ...newMapPointerInfo,
                  valueState: { error },
                }
              : null,
          );
        });
    },
    [enabled, dataset, time, variable],
  );

  // TODO: using MAP_OBJECTS here is really a bad idea,
  //   but it seems we have no choice.
  const map = MAP_OBJECTS["map"] as OlMap | undefined;

  useEffect(() => {
    if (enabled && map) {
      const listener = (event: OlMapBrowserEvent<PointerEvent>) => {
        if (!event.dragging) {
          updateCoordinateDisplay(event);
        } else {
          setMapPointInfo(null);
        }
      };

      map.on("pointermove", listener);
      return () => {
        map.un("pointermove", listener);
      };
    } else {
      setMapPointInfo(null);
    }
  }, [enabled, map, updateCoordinateDisplay]);

  return mapPointInfo;
}
