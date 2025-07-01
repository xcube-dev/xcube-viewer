/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
import { RefObject } from "react";

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

export function getMapElement(): RefObject<HTMLDivElement | null> {
  const targetElement = MAP_OBJECTS["map"]
    ? (MAP_OBJECTS["map"] as OlMap).getTargetElement()
    : null;
  return { current: targetElement as HTMLDivElement | null };
}

export function getHiddenElements(element: HTMLElement | null) {
  if (!element) return [];
  return [
    element.querySelector(".ol-unselectable.ol-control.MuiBox-root.css-0"),
    element.querySelector(".ol-zoom.ol-unselectable.ol-control"),
  ].filter(Boolean) as HTMLElement[];
}
