/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlView, ViewOptions as OlViewOptions } from "ol/View";
import { default as OlVectorLayer } from "ol/layer/Vector";
import { default as OlFeature } from "ol/Feature";
import {
  ProjectionLike as OlProjectionLike,
  transform as olTransform,
} from "ol/proj";

import { MapComponent, MapComponentProps } from "./MapComponent";

interface ViewProps extends MapComponentProps, OlViewOptions {}

export class View extends MapComponent<OlView, ViewProps> {
  addMapObject(map: OlMap): OlView {
    return this.updateView(map);
  }

  removeMapObject(_map: OlMap, _object: OlView): void {}

  updateMapObject(map: OlMap, _object: OlView): OlView {
    return this.updateView(map);
  }

  updateView(map: OlMap): OlView {
    const newProjection = this.props.projection;
    let oldProjection: OlProjectionLike = map.getView().getProjection();
    if (typeof newProjection === "string") {
      if (oldProjection) {
        oldProjection = oldProjection.getCode();
      }
    }
    if (newProjection && newProjection !== oldProjection) {
      const oldView = map.getView();
      const newView = new OlView({
        ...this.props,
        center: olTransform(
          oldView.getCenter() || [0, 0],
          oldProjection,
          newProjection,
        ),
        minZoom: oldView.getMinZoom(),
        zoom: oldView.getZoom(),
      });
      map.getLayers().forEach((layer) => {
        if (layer instanceof OlVectorLayer) {
          layer.getSource().forEachFeature((feature: OlFeature) => {
            feature.getGeometry()?.transform(oldProjection, newProjection);
          });
        }
      });
      map.setView(newView);
    } else {
      map.getView().setProperties(this.props);
    }
    return map.getView();
  }
}
