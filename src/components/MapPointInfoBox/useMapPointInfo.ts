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

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { default as OlMap } from "ol/Map";
import { default as OlMapBrowserEvent } from "ol/MapBrowserEvent";
import { transform as olTransform } from "ol/proj";

import { getPointValue } from "@/api";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { MAP_OBJECTS } from "@/states/controlState";
import MapPointInfo, { Location, Payload } from "./MapPointInfo";

export default function useMapPointInfo(
  enabled: boolean,
  serverUrl: string,
  dataset: Dataset | null,
  variable: Variable | null,
  dataset2: Dataset | null,
  variable2: Variable | null,
  time: string | null,
): MapPointInfo | null {
  const lastFetchTime = useRef(0);
  const [location, setLocation] = useState<Location>();
  const [payload, setPayload] = useState<Payload>();
  const [payload2, setPayload2] = useState<Payload>();

  const fetchPointValue = useCallback(
    async (
      dataset: Dataset,
      variable: Variable,
      lon: number,
      lat: number,
      setPayload: (payload: Payload | undefined) => void,
    ) => {
      setPayload({ dataset, variable, result: { fetching: true } });
      try {
        const result = await getPointValue(
          serverUrl,
          dataset,
          variable,
          lon,
          lat,
          time,
          null,
        );
        console.info(variable.name, "=", result);
        setPayload({ dataset, variable, result: { value: result.value } });
      } catch (error) {
        setPayload({ dataset, variable, result: { error } });
      }
    },
    [serverUrl, time],
  );

  const handlePointerMove = useCallback(
    (event: OlMapBrowserEvent<PointerEvent>) => {
      const map = event.map;
      if (!enabled || !dataset || !variable || !map) {
        setPayload(undefined);
        setPayload2(undefined);
        return;
      }
      const pixelX = event.pixel[0];
      const pixelY = event.pixel[1];
      const geoCoordinate = olTransform(
        event.coordinate,
        map.getView().getProjection().getCode(),
        "EPSG:4326",
      );
      const lon = geoCoordinate[0];
      const lat = geoCoordinate[1];
      setLocation({ pixelX, pixelY, lon, lat });

      // Throttle
      const currentTime = new Date().getTime();
      if (currentTime - lastFetchTime.current >= 500) {
        fetchPointValue(dataset, variable, lon, lat, setPayload).finally(() => {
          lastFetchTime.current = currentTime;
          if (dataset2 && variable2) {
            void fetchPointValue(dataset2, variable2, lon, lat, setPayload2);
          }
        });
      }
    },
    [fetchPointValue, enabled, dataset, variable, dataset2, variable2],
  );

  // TODO: using MAP_OBJECTS here is really a bad idea,
  //   but it seems we have no choice.
  const map = MAP_OBJECTS["map"] as OlMap | undefined;

  useEffect(() => {
    if (enabled && map) {
      const listener = (event: OlMapBrowserEvent<PointerEvent>) => {
        if (!event.dragging) {
          handlePointerMove(event);
        } else {
          setLocation(undefined);
        }
      };

      map.on("pointermove", listener);
      return () => {
        map.un("pointermove", listener);
      };
    } else {
      setLocation(undefined);
    }
  }, [enabled, map, handlePointerMove]);

  return useMemo(
    () =>
      location && payload
        ? {
            location,
            payload,
            payload2,
          }
        : null,
    [location, payload, payload2],
  );
}
