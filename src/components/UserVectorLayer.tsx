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

import * as React from "react";
import { default as OlVectorSource } from "ol/source/Vector";

import { Vector } from "./ol/layer/Vector";
import { PlaceGroup, USER_DRAWN_PLACE_GROUP_ID } from "../model/place";
import { default as OlGeoJSONFormat } from "ol/format/GeoJSON";
import { setFeatureStyle } from "./ol/style";
import { Config } from "../config";

interface UserVectorLayerProps {
  placeGroup: PlaceGroup;
  mapProjection: string;
  visible?: boolean;
}

const UserVectorLayer: React.FC<UserVectorLayerProps> = ({
  placeGroup,
  mapProjection,
  visible,
}) => {
  const sourceRef = React.useRef<OlVectorSource>(new OlVectorSource());

  React.useEffect(() => {
    const source = sourceRef.current;
    const places = placeGroup.features;
    if (places.length === 0) {
      source.clear();
    } else {
      const sourceFeatures = source.getFeatures();
      const sourceFeatureIds = new Set(sourceFeatures.map((f) => f.getId()));
      const placeGroupIds = new Set(places.map((f) => f.id));

      const placesToBeAdded = places.filter((f) => !sourceFeatureIds.has(f.id));
      const sourceFeaturesToBeRemoved = sourceFeatures.filter(
        (f) => !placeGroupIds.has(f.getId() + ""),
      );

      sourceFeaturesToBeRemoved.forEach((f) => source.removeFeature(f));
      placesToBeAdded.forEach((place) => {
        const feature = new OlGeoJSONFormat().readFeature(place, {
          dataProjection: "EPSG:4326",
          featureProjection: mapProjection,
        });
        if (feature.getId() !== place.id) {
          feature.setId(place.id);
        }
        const color = (place.properties || {}).color || "red";
        const pointSymbol = (place.properties || {}).source
          ? "diamond"
          : "circle";
        setFeatureStyle(
          feature,
          color,
          Config.instance.branding.polygonFillOpacity,
          pointSymbol,
        );
        source.addFeature(feature);
      });
    }
  }, [placeGroup, mapProjection]);

  return (
    <Vector
      id={placeGroup.id}
      opacity={placeGroup.id === USER_DRAWN_PLACE_GROUP_ID ? 1 : 0.8}
      visible={visible}
      zIndex={500}
      source={sourceRef.current}
    />
  );
};

export default UserVectorLayer;
