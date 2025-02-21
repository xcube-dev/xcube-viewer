/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlStyle } from "ol/style/Style";
import { default as OlFeature } from "ol/Feature";
import { default as OlFillStyle } from "ol/style/Fill";
import { default as OlStrokeStyle } from "ol/style/Stroke";
import { default as OlCircleStyle } from "ol/style/Circle";
import { default as OlRegularShape } from "ol/style/RegularShape";
import { default as OlImageStyle } from "ol/style/Image";
import { Color as OlColor } from "ol/color";
import { default as OlPoint } from "ol/geom/Point";
import rgba from "color-rgba";

export type PointSymbol = "circle" | "square" | "diamond";

export function setFeatureStyle(
  feature: OlFeature,
  color: string,
  fillOpacity?: number,
  pointSymbol: PointSymbol = "circle",
) {
  if (feature.getGeometry() instanceof OlPoint) {
    feature.setStyle(
      createPointGeometryStyle(7, color, "white", 2, pointSymbol),
    );
  } else {
    fillOpacity = typeof fillOpacity === "number" ? fillOpacity : 0.25;
    let fillColorRgba = rgba(color);
    if (Array.isArray(fillColorRgba)) {
      fillColorRgba = [
        fillColorRgba[0],
        fillColorRgba[1],
        fillColorRgba[2],
        fillOpacity,
      ];
    } else {
      fillColorRgba = [255, 255, 255, fillOpacity];
    }
    feature.setStyle(createGeometryStyle(fillColorRgba, color, 2));
  }
}

export function createPointGeometryStyle(
  radius: number,
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  pointSymbol: PointSymbol = "circle",
): OlStyle {
  return new OlStyle({
    image: createImageStyle(
      radius,
      fillColor,
      strokeColor,
      strokeWidth,
      pointSymbol,
    ),
  });
}

function createImageStyle(
  radius: number,
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  pointSymbol: PointSymbol,
): OlImageStyle {
  const fill = new OlFillStyle({
    color: fillColor,
  });
  const stroke = new OlStrokeStyle({
    color: strokeColor,
    width: strokeWidth,
  });
  switch (pointSymbol) {
    case "square":
      return new OlRegularShape({
        fill,
        stroke,
        radius,
        points: 4,
        angle: Math.PI / 4,
        rotation: 0.0,
      });
    case "diamond":
      return new OlRegularShape({
        fill,
        stroke,
        radius,
        points: 4,
        angle: Math.PI / 4,
        rotation: Math.PI / 4,
      });
    default:
      return new OlCircleStyle({
        fill,
        stroke,
        radius,
      });
  }
}

export function createGeometryStyle(
  fillColor: string | OlColor,
  strokeColor: string | OlColor,
  strokeWidth: number,
): OlStyle {
  const fill = new OlFillStyle({
    color: fillColor,
  });
  const stroke = new OlStrokeStyle({
    color: strokeColor,
    width: strokeWidth,
  });
  return new OlStyle({ fill, stroke });
}
