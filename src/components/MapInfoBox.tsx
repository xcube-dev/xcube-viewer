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

import { useEffect, useMemo, useState } from "react";
import { default as OlMap } from "ol/Map";
import { Coordinate as OlCoordinate } from "ol/coordinate";
import { default as OlMapBrowserEvent } from "ol/MapBrowserEvent";
import { transform as olTransform } from "ol/proj";
import { throttle } from "@/util/throttle";
import Box from "@mui/material/Box";

interface MapInfoBoxProps {
  map: OlMap | null;
}

export default function MapInfoBox({ map }: MapInfoBoxProps) {
  const [geoCoordinate, setGeoCoordinate] = useState<OlCoordinate | null>(null);
  const updateCoordinateDisplay = useMemo(
    () =>
      throttle((mapCoordinate: OlCoordinate) => {
        if (!map) {
          return;
        }
        const geoCoordinate = olTransform(
          mapCoordinate,
          map.getView().getProjection().getCode(),
          "EPSG:4326",
        );
        console.log("coordinate", geoCoordinate);
        setGeoCoordinate(geoCoordinate);
      }, 500),
    [map],
  );

  useEffect(() => {
    if (map) {
      const listener = (evt: OlMapBrowserEvent<PointerEvent>) => {
        if (!evt.dragging) {
          setGeoCoordinate(null);
          //info.style.visibility = "hidden";
          //currentFeature = undefined;
          return;
        }
        updateCoordinateDisplay(evt.coordinate);
      };

      map.on("pointermove", listener);
      return () => {
        map.un("pointermove", listener);
      };
    }
  }, [map, updateCoordinateDisplay]);

  if (geoCoordinate === null) {
    return null;
  }

  return <Box>{`Coordinate: ${geoCoordinate}`}</Box>;
}
