/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { default as OlVectorSource } from "ol/source/Vector";
import { default as OlGeoJSONFormat } from "ol/format/GeoJSON";

import { getUserPlaceFillOpacity } from "@/config";
import { PlaceGroup, USER_DRAWN_PLACE_GROUP_ID } from "@/model/place";
import { Vector } from "./ol/layer/Vector";
import { setFeatureStyle } from "./ol/style";

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
        const opacity = (place.properties || {}).opacity;
        const pointSymbol = (place.properties || {}).source
          ? "diamond"
          : "circle";
        setFeatureStyle(
          feature,
          color,
          getUserPlaceFillOpacity(opacity),
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
      zIndex={501}
      source={sourceRef.current}
    />
  );
};

export default UserVectorLayer;
