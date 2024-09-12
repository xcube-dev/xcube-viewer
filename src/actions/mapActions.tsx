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

import { default as OlMap } from "ol/Map";
import { Geometry as OlGeometry } from "ol/geom";
import { Vector as OlVectorLayer } from "ol/layer";
import { Vector as OlVectorSource } from "ol/source";
import { fromExtent } from "ol/geom/Polygon";
import { Extent as OlExtent } from "ol/extent";
import { getCenter } from "ol/extent";
import { default as OlSimpleGeometry } from "ol/geom/SimpleGeometry";

import { GEOGRAPHIC_CRS } from "@/model/proj";
import { MAP_OBJECTS } from "@/states/controlState";
import { PlaceStyle } from "@/model/place";
import { setFeatureStyle } from "@/components/ol/style";

// noinspection JSUnusedLocalSymbols
export function renameUserPlaceInLayer(
  placeGroupId: string,
  _placeId: string,
  _newName: string,
) {
  if (MAP_OBJECTS[placeGroupId]) {
    // const userLayer = MAP_OBJECTS[placeGroupId] as OlVectorLayer;
    // const source = userLayer.getSource();
    // TODO (forman): update feature source in user layer to reflect newName.
    //  Note, this is not yet an issue, because we still don't show user places labels
    //  in the viewer.
  }
}

export function restyleUserPlaceInLayer(
  placeGroupId: string,
  placeId: string,
  placeStyle: PlaceStyle,
) {
  if (MAP_OBJECTS[placeGroupId]) {
    const userLayer = MAP_OBJECTS[
      placeGroupId
    ] as OlVectorLayer<OlVectorSource>;
    const source = userLayer.getSource();
    const feature = source?.getFeatureById(placeId);
    if (feature) {
      // console.log("selected feature:", feature, placeStyle);
      setFeatureStyle(feature, placeStyle.color, placeStyle.opacity);
    }
  }
}

export function locateInMap(
  mapId: string,
  location: OlGeometry | OlExtent,
  shouldZoom: boolean,
) {
  if (MAP_OBJECTS[mapId]) {
    const map = MAP_OBJECTS[mapId] as OlMap;
    const projection = map.getView().getProjection();
    const _geometry = Array.isArray(location) ? fromExtent(location) : location;
    const geometry = _geometry.transform(
      GEOGRAPHIC_CRS,
      projection,
    ) as OlSimpleGeometry;
    if (geometry.getType() === "Point") {
      // Points don't zoom. Just reset map center.
      // Not ideal, but better than zooming in too deep (see #54)
      map.getView().setCenter(geometry.getFirstCoordinate());
    } else if (!shouldZoom) {
      map.getView().setCenter(getCenter(geometry.getExtent()));
    } else {
      map.getView().fit(geometry, { size: map.getSize() });
    }
  }
}
