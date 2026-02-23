/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlVectorLayer } from "ol/layer/Vector";
import { default as OlVectorSource } from "ol/source/Vector";
import { default as OlDrawInteraction } from "ol/interaction/Draw";
import { DrawEvent as OlDrawEvent } from "ol/interaction/Draw";
import { Options as OlDrawInteractionOptions } from "ol/interaction/Draw";

import { MapComponent, MapComponentProps } from "../MapComponent";

export type DrawEvent = OlDrawEvent;
export type DrawListener =
  | ((event: DrawEvent) => void)
  | ((event: DrawEvent) => boolean);

interface DrawProps extends MapComponentProps, OlDrawInteractionOptions {
  layerId?: string;
  active?: boolean;
  onDrawStart?: DrawListener;
  onDrawEnd?: DrawListener;
}

export class Draw extends MapComponent<OlDrawInteraction, DrawProps> {
  addMapObject(map: OlMap): OlDrawInteraction {
    const draw = new OlDrawInteraction(this.getOptions());
    const active = !!this.props.active;
    draw.setActive(active);
    map.addInteraction(draw);
    if (active) {
      this.listen(draw, this.props);
    }
    return draw;
  }

  updateMapObject(
    _map: OlMap,
    draw: OlDrawInteraction,
    prevProps: Readonly<DrawProps>,
  ): OlDrawInteraction {
    draw.setProperties(this.getOptions());
    const active = !!this.props.active;
    draw.setActive(active);
    this.unlisten(draw, prevProps);
    if (active) {
      this.listen(draw, this.props);
    }
    return draw;
  }

  removeMapObject(map: OlMap, draw: OlDrawInteraction): void {
    this.unlisten(draw, this.props);
    map.removeInteraction(draw);
  }

  getOptions(): OlDrawInteractionOptions {
    const options = super.getOptions();
    delete options["layerId"];
    delete options["active"];
    delete options["onDrawStart"];
    delete options["onDrawEnd"];
    const layerId = this.props.layerId;
    if (layerId && !options.source) {
      const vectorLayer = this.getMapObject(layerId);
      if (vectorLayer) {
        options["source"] = (
          vectorLayer as OlVectorLayer<OlVectorSource>
        ).getSource();
      }
    }
    return options as OlDrawInteractionOptions;
  }

  private listen(draw: OlDrawInteraction, props: Readonly<DrawProps>) {
    const { onDrawStart, onDrawEnd } = props;
    if (onDrawStart) {
      draw.on("drawstart", onDrawStart);
    }
    if (onDrawEnd) {
      draw.on("drawend", onDrawEnd);
    }
  }

  private unlisten(draw: OlDrawInteraction, props: Readonly<DrawProps>) {
    const { onDrawStart, onDrawEnd } = props;
    if (onDrawStart) {
      draw.un("drawstart", onDrawStart);
    }
    if (onDrawEnd) {
      draw.un("drawend", onDrawEnd);
    }
  }
}
