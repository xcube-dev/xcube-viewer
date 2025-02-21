/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlVectorLayer } from "ol/layer/Vector";
import { default as OlVectorSource } from "ol/source/Vector";
import { default as OlSelectInteraction } from "ol/interaction/Select";
import { default as OlFeature } from "ol/Feature";
import { default as OlRenderFeature } from "ol/render/Feature";
import { default as OlStyle } from "ol/style/Style";
import { StyleLike as OlStyleLike } from "ol/style/Style";
import { default as OlFillStyle } from "ol/style/Fill";
import { default as OlStrokeStyle } from "ol/style/Stroke";
import { default as OlCircleStyle } from "ol/style/Circle";
import { Color as OlColor } from "ol/color";
import { SelectEvent as OlSelectEvent } from "ol/interaction/Select";
import { Options as OlSelectInteractionOptions } from "ol/interaction/Select";

import { MapComponent, MapComponentProps } from "../MapComponent";

export type SelectEvent = OlSelectEvent;
export type SelectListener =
  | ((event: SelectEvent) => void)
  | ((event: SelectEvent) => boolean);

interface SelectProps extends MapComponentProps, OlSelectInteractionOptions {
  onSelect?: SelectListener;
  selectedFeaturesIds?: string[];
}

export class Select extends MapComponent<OlSelectInteraction, SelectProps> {
  addMapObject(map: OlMap): OlSelectInteraction {
    const select = new OlSelectInteraction({
      style: styleFunction,
      ...this.getOptions(),
    });
    map.addInteraction(select);
    this.updateSelection(select);
    this.listen(select, this.props);
    return select;
  }

  updateMapObject(
    _map: OlMap,
    select: OlSelectInteraction,
    prevProps: Readonly<SelectProps>,
  ): OlSelectInteraction {
    select.setProperties(this.getOptions());
    this.updateSelection(select);
    this.unlisten(select, prevProps);
    this.listen(select, this.props);
    return select;
  }

  removeMapObject(map: OlMap, select: OlSelectInteraction): void {
    this.unlisten(select, this.props);
    map.removeInteraction(select);
  }

  getOptions(): OlSelectInteractionOptions {
    const options = super.getOptions();
    delete options["onSelect"];
    delete options["selectedFeaturesIds"];
    return options;
  }

  // noinspection JSMethodCanBeStatic
  private listen(select: OlSelectInteraction, props: Readonly<SelectProps>) {
    const { onSelect } = props;
    if (onSelect) {
      select.on("select", onSelect);
    }
  }

  // noinspection JSMethodCanBeStatic,SpellCheckingInspection
  private unlisten(select: OlSelectInteraction, props: Readonly<SelectProps>) {
    const { onSelect } = props;
    if (onSelect) {
      select.un("select", onSelect);
    }
  }

  private updateSelection(select: OlSelectInteraction) {
    if (this.context.map && this.props.selectedFeaturesIds) {
      const selectedFeatures = findFeaturesByIds(
        this.context.map!,
        this.props.selectedFeaturesIds,
      ).filter((f) => f !== null) as OlFeature[];
      // console.log("Select: ", this.props.selectedFeaturesIds, selectedFeatures);
      if (selectedFeatures.length > 0) {
        // TODO (forman): must get around OpenLayers weirdness here: Selection style function is called only
        // if a feature does not have any styles set.
        select.getFeatures().clear();
        select.getFeatures().extend(selectedFeatures);
        this.context.map.render();
      }
    }
  }
}

const OL_DEFAULT_FILL = new OlFillStyle({
  color: [255, 255, 255, 0.4],
});
const OL_DEFAULT_STROKE_WIDTH = 1.25;
const OL_DEFAULT_STROKE = new OlStrokeStyle({
  color: "#3399CC",
  width: OL_DEFAULT_STROKE_WIDTH,
});
const OL_DEFAULT_CIRCLE_RADIUS = 5;

const SELECT_STROKE_COLOR: OlColor = [255, 255, 0, 0.7];

function styleFunction(
  feature: OlFeature | OlRenderFeature,
  _resolution: number,
) {
  // console.log('style func: properties: ', feature.getProperties());
  // console.log('style func: style: ', (feature as any).getStyle());

  let defaultFill = OL_DEFAULT_FILL;
  let defaultStroke = OL_DEFAULT_STROKE;
  let defaultRadius = OL_DEFAULT_CIRCLE_RADIUS;

  if (feature instanceof OlFeature) {
    let style = feature.getStyle();
    if (Array.isArray(style)) {
      style = style[0];
    } else if (typeof style === "function") {
      style = style(feature, 0) as OlStyleLike;
    }
    if (style instanceof OlStyle) {
      const imageStyle = style.getImage() as unknown;
      if (imageStyle instanceof OlCircleStyle) {
        defaultFill = imageStyle.getFill();
        defaultStroke = imageStyle.getStroke();
        defaultRadius = imageStyle.getRadius();
      } else {
        defaultFill = style.getFill();
        defaultStroke = style.getStroke();
      }
    }
  }

  const styleOptions = {
    fill: defaultFill,
    stroke: new OlStrokeStyle({
      width: 1.5 * (defaultStroke.getWidth() || 1),
      color: SELECT_STROKE_COLOR,
    }),
  };
  const geometry = feature.getGeometry();
  if (geometry && geometry.getType() === "Point") {
    return new OlStyle({
      image: new OlCircleStyle({
        radius: 1.5 * defaultRadius,
        ...styleOptions,
      }),
    });
  } else {
    return new OlStyle(styleOptions);
  }
}

type FeatureId = string | number;

function findFeaturesByIds(
  map: OlMap,
  featureIds: FeatureId[],
): (OlFeature | null)[] {
  return featureIds.map((featureId) => findFeatureById(map, featureId));
}

function findFeatureById(map: OlMap, featureId: FeatureId): OlFeature | null {
  for (const layer of map.getLayers().getArray()) {
    if (layer instanceof OlVectorLayer) {
      const vectorLayer = layer as OlVectorLayer<OlVectorSource>;
      const feature = vectorLayer.getSource()?.getFeatureById(featureId);
      if (feature) {
        return feature;
      }
    }
  }
  return null;
}
