/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlScaleLineControl } from "ol/control/ScaleLine";
import { Options as OlScaleLineControlOptions } from "ol/control/ScaleLine";

import { MapComponent, MapComponentProps } from "../MapComponent";

interface ScaleLineProps extends MapComponentProps, OlScaleLineControlOptions {
  bar?: boolean;
  steps?: number;
  text?: boolean;
}

export class ScaleLine extends MapComponent<
  OlScaleLineControl,
  ScaleLineProps
> {
  addMapObject(map: OlMap): OlScaleLineControl {
    const control = new OlScaleLineControl(this.getOptions());
    map.addControl(control);
    return control;
  }

  updateMapObject(
    _map: OlMap,
    control: OlScaleLineControl,
    _prevProps: Readonly<ScaleLineProps>,
  ): OlScaleLineControl {
    control.setProperties(this.getOptions());
    return control;
  }

  removeMapObject(map: OlMap, control: OlScaleLineControl): void {
    map.removeControl(control);
  }
}
