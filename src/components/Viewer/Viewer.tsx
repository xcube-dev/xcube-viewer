/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useCallback, useEffect, useState } from "react";
import { Theme, useTheme } from "@mui/system";
import * as geojson from "geojson";
import { default as OlMap } from "ol/Map";
import { default as OlFeature } from "ol/Feature";
import { default as OlGeoJSONFormat } from "ol/format/GeoJSON";
import { default as OlCircleGeometry } from "ol/geom/Circle";
import { fromCircle as olPolygonFromCircle } from "ol/geom/Polygon";
import { default as OlVectorLayer } from "ol/layer/Vector";
import { default as OlMapBrowserEvent } from "ol/MapBrowserEvent";
import { default as OlVectorSource } from "ol/source/Vector";
import { default as OlTileLayer } from "ol/layer/Tile";
import { default as OlCircleStyle } from "ol/style/Circle";
import { default as OlFillStyle } from "ol/style/Fill";
import { default as OlStrokeStyle } from "ol/style/Stroke";
import { default as OlStyle } from "ol/style/Style";
import { getRenderPixel } from "ol/render";
import RenderEvent from "ol/render/Event";
import { default as OlLayer } from "ol/layer/Layer";
import { Pixel } from "ol/pixel";

import i18n from "@/i18n";
import {
  getUserPlaceColor,
  getUserPlaceColorName,
  getUserPlaceFillOpacity,
} from "@/config";
import {
  Place,
  PlaceGroup,
  USER_DRAWN_PLACE_GROUP_ID,
  USER_ID_PREFIX,
} from "@/model/place";
import { MAP_OBJECTS, MapInteraction } from "@/states/controlState";
import { newId } from "@/util/id";
import { GEOGRAPHIC_CRS } from "@/model/proj";
import UserVectorLayer from "@/components/UserVectorLayer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ScaleLine } from "@/components/ol/control/ScaleLine";
import { Draw, DrawEvent } from "@/components/ol/interaction/Draw";
import { Layers } from "@/components/ol/layer/Layers";
import { Vector } from "@/components/ol/layer/Vector";
import { Map, MapElement, TileLoadProgress } from "@/components/ol/Map";
import { View } from "@/components/ol/View";
import { setFeatureStyle } from "@/components/ol/style";
import { findMapLayer } from "@/components/ol/util";
import { isNumber } from "@/util/types";

import { getDatasetZLevel } from "@/model/dataset";

const SELECTION_LAYER_ID = "selection";
const SELECTION_LAYER_SOURCE = new OlVectorSource();

// TODO (forman): move all map styles into dedicated module,
//  so settings will be easier to find & adjust

const SELECTION_COLOR = [255, 220, 0, 0.8];

const SELECTION_LAYER_STROKE = new OlStrokeStyle({
  color: SELECTION_COLOR,
  width: 10,
  lineCap: "square",
  lineDash: [10, 15],
});

const SELECTION_LAYER_FILL = new OlFillStyle({
  color: [0, 0, 0, 0],
});

const SELECTION_LAYER_STYLE = new OlStyle({
  stroke: SELECTION_LAYER_STROKE,
  fill: SELECTION_LAYER_FILL,
  image: new OlCircleStyle({
    radius: 15,
    stroke: new OlStrokeStyle({
      color: SELECTION_COLOR,
      width: 6,
      lineCap: "square",
      lineDash: [6, 6],
    }),
    fill: SELECTION_LAYER_FILL,
  }),
});

interface ViewerProps {
  theme: Theme;
  mapId: string;
  mapInteraction: MapInteraction;
  mapProjection: string;
  baseMapLayers?: MapElement[];
  overlayLayers?: MapElement[];
  rgb2Layer?: MapElement;
  rgbLayer?: MapElement;
  variable2Layer?: MapElement;
  variableLayer?: MapElement;
  datasetBoundaryLayer?: MapElement;
  placeGroupLayers?: MapElement;
  colorBarLegend?: MapElement;
  colorBarLegend2?: MapElement;
  mapSplitter?: MapElement;
  mapPointInfoBox?: MapElement;
  mapControlActions?: MapElement;
  userDrawnPlaceGroupName: string;
  addDrawnUserPlace?: (
    placeGroupTitle: string,
    id: string,
    properties: Record<string, unknown>,
    geometry: geojson.Geometry,
    selected: boolean,
  ) => void;
  userPlaceGroups: PlaceGroup[];
  userPlaceGroupsVisibility: { [pgId: string]: boolean };
  showUserPlaces: boolean;
  selectPlace?: (
    placeId: string | null,
    places: Place[],
    showInMap: boolean,
  ) => void;
  selectedPlaceId?: string | null;
  places: Place[];
  imageSmoothing?: boolean;
  variableSplitPos?: number;
  onMapRef?: (map: OlMap | null) => void;
  importUserPlacesFromText?: (text: string) => void;
  setZoomLevel?: (zoomLevel: number | undefined) => void;
  setDatasetZLevel?: (datasetZLevel: number | undefined) => void;
  zoomBox?: MapElement;
}

export default function Viewer({
  theme,
  mapId,
  mapInteraction,
  mapProjection,
  baseMapLayers,
  overlayLayers,
  rgb2Layer,
  rgbLayer,
  variable2Layer,
  variableLayer,
  datasetBoundaryLayer,
  placeGroupLayers,
  colorBarLegend,
  colorBarLegend2,
  mapSplitter,
  mapPointInfoBox,
  mapControlActions,
  userDrawnPlaceGroupName,
  addDrawnUserPlace,
  importUserPlacesFromText,
  userPlaceGroups,
  userPlaceGroupsVisibility,
  showUserPlaces,
  selectPlace,
  selectedPlaceId,
  places,
  imageSmoothing,
  variableSplitPos,
  onMapRef,
  zoomBox,
  setZoomLevel,
  setDatasetZLevel,
}: ViewerProps) {
  theme = useTheme();

  // TODO (forman): there is way too much logic in this component!
  //    Extract code into dedicated hooks or actions/reducers.

  const [map, setMap] = useState<OlMap | null>(null);
  const [selectedPlaceIdPrev, setSelectedPlaceIdPrev] = useState<string | null>(
    selectedPlaceId || null,
  );

  // If the place selection changed in the UI,
  // synchronize selection in the map.
  useEffect(() => {
    if (map) {
      const selectedPlaceIdCurr = selectedPlaceId || null;
      if (selectedPlaceIdCurr !== selectedPlaceIdPrev) {
        if (MAP_OBJECTS[SELECTION_LAYER_ID]) {
          const selectionLayer = MAP_OBJECTS[
            SELECTION_LAYER_ID
          ] as OlVectorLayer<OlVectorSource>;
          const selectionSource = selectionLayer.getSource()!;
          selectionSource.clear();
          if (selectedPlaceIdCurr) {
            const selectedFeature = findFeatureById(map, selectedPlaceIdCurr);
            if (selectedFeature) {
              // We clone features, so we can set a new ID and clear the style, so the selection
              // layer style is used instead as default.
              const displayFeature = selectedFeature.clone();
              displayFeature.setId("select-" + selectedFeature.getId());
              displayFeature.setStyle(undefined);
              selectionSource.addFeature(displayFeature);
            }
          }
          setSelectedPlaceIdPrev(selectedPlaceIdCurr);
        }
      }
    }
  }, [map, selectedPlaceId, selectedPlaceIdPrev]);

  // If imageSmoothing changed, notify all tile layers.
  useEffect(() => {
    // Force layer source updates after imageSmoothing change
    if (map) {
      map.getLayers().forEach((layer) => {
        if (layer instanceof OlTileLayer) {
          layer.getSource()!.changed();
        } else {
          layer.changed();
        }
      });
    }
  }, [map, imageSmoothing]);

  // If variableSplitPos changed, adjust Canvas2D clip
  // paths of concerned layers.
  useEffect(() => {
    if (map === null || !isNumber(variableSplitPos)) {
      return;
    }

    // https://openlayers.org/en/latest/examples/layer-swipe.html

    const handlePreRenderL = (event: RenderEvent) => {
      setLayerClip(map, event, variableSplitPos, 0);
    };

    const handlePreRenderR = (event: RenderEvent) => {
      setLayerClip(map, event, variableSplitPos, 1);
    };

    const handlePostRender = (event: RenderEvent) => {
      const ctx = event.context as CanvasRenderingContext2D;
      ctx.restore();
    };

    const rgb2Layer = findMapLayer(map, "rgb2");
    const variable2Layer = findMapLayer(map, "variable2");
    const rgbLayer = findMapLayer(map, "rgb");
    const variableLayer = findMapLayer(map, "variable");
    const preRenders: [OlLayer | null, (e: RenderEvent) => void][] = [
      [rgb2Layer, handlePreRenderL],
      [variable2Layer, handlePreRenderL],
      [rgbLayer, handlePreRenderR],
      [variableLayer, handlePreRenderR],
    ];
    for (const [layer, handlePreRender] of preRenders) {
      if (layer) {
        layer.on("prerender", handlePreRender);
        layer.on("postrender", handlePostRender);
      }
    }
    return () => {
      for (const [layer, handlePreRender] of preRenders) {
        if (layer) {
          layer.un("prerender", handlePreRender);
          layer.un("postrender", handlePostRender);
        }
      }
    };
  });

  const handleMapClick = (event: OlMapBrowserEvent<UIEvent>) => {
    if (mapInteraction === "Select") {
      const map = event.map;
      let selectedPlaceId: string | null = null;
      const features = map.getFeaturesAtPixel(event.pixel);
      if (features) {
        for (const f of features) {
          if (typeof f["getId"] === "function") {
            selectedPlaceId = f["getId"]() + "";
            break;
          }
        }
      }
      if (selectPlace) {
        selectPlace(selectedPlaceId, places, false);
      }
    }
  };

  const handleDrawEnd = (event: DrawEvent) => {
    if (map !== null && addDrawnUserPlace && mapInteraction !== "Select") {
      const feature = event.feature;
      let geometry = feature.getGeometry();
      if (!geometry) {
        return;
      }

      const placeId = newId(
        USER_ID_PREFIX + mapInteraction.toLowerCase() + "-",
      );
      const projection = map.getView().getProjection();

      if (geometry instanceof OlCircleGeometry) {
        const polygon = olPolygonFromCircle(geometry as OlCircleGeometry);
        feature.setGeometry(polygon);
      }

      // Beware: transform() is an in-place op
      geometry = feature
        .clone()
        .getGeometry()!
        .transform(projection, GEOGRAPHIC_CRS);
      const geoJSONGeometry = new OlGeoJSONFormat().writeGeometryObject(
        geometry,
      ) as geojson.Geometry;
      feature.setId(placeId);
      let colorIndex = 0;
      if (MAP_OBJECTS[USER_DRAWN_PLACE_GROUP_ID]) {
        const userLayer = MAP_OBJECTS[
          USER_DRAWN_PLACE_GROUP_ID
        ] as OlVectorLayer<OlVectorSource>;
        const features = userLayer?.getSource()?.getFeatures();
        if (features) colorIndex = features.length;
      }
      const label = findNextLabel(userPlaceGroups, mapInteraction);
      const color = getUserPlaceColorName(colorIndex);
      const shadedColor = getUserPlaceColor(color, theme.palette.mode);
      setFeatureStyle(feature, shadedColor, getUserPlaceFillOpacity());

      addDrawnUserPlace(
        userDrawnPlaceGroupName,
        placeId,
        { label, color },
        geoJSONGeometry,
        true,
      );
    }
    return true;
  };

  function handleMapRef(map: OlMap | null) {
    if (onMapRef) {
      onMapRef(map);
    }
    setMap(map);
  }

  const handleDropFiles = (files: File[]) => {
    if (importUserPlacesFromText) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            importUserPlacesFromText(reader.result);
          }
        };
        reader.readAsText(file, "UTF-8");
      });
    }
  };

  const handleTileLoadProgress = useCallback((p: TileLoadProgress) => {
    console.log("tile load progress:", p);
  }, []);

  const handleMapZoom = (
    event: OlMapBrowserEvent<UIEvent>,
    map: OlMap | undefined,
  ) => {
    if (setZoomLevel) {
      const zoomLevel = event.target.getZoom();
      setZoomLevel(zoomLevel);
    }

    if (setDatasetZLevel) {
      const datasetZLevel = getDatasetZLevel(event.target, map);
      setDatasetZLevel(datasetZLevel);
    }
  };

  useEffect(() => {
    /* Force update of datasetZLevel after variable change. This is needed at
       the moment and might become redundant in the future.
       This ensures that datasetZLevel gets set, when the Viewer starts, so that
       the datasetLevel can be calculated.
     */
    if (map) {
      if (setDatasetZLevel) {
        const datasetZLevel = getDatasetZLevel(map.getView(), map);
        setDatasetZLevel(datasetZLevel);
      }
    }
  }, [map, variableLayer, setDatasetZLevel]);

  return (
    <ErrorBoundary>
      <Map
        id={mapId}
        onClick={(event) => handleMapClick(event)}
        onZoom={(event, map) => handleMapZoom(event, map)}
        onMapRef={handleMapRef}
        mapObjects={MAP_OBJECTS}
        isStale={true}
        onDropFiles={handleDropFiles}
        onTileLoadProgress={handleTileLoadProgress}
      >
        <View id="view" projection={mapProjection} />
        <Layers>
          {<>{baseMapLayers}</>}
          {rgb2Layer}
          {rgbLayer}
          {variable2Layer}
          {variableLayer}
          {<>{overlayLayers}</>}
          {datasetBoundaryLayer}
          <Vector
            id={SELECTION_LAYER_ID}
            opacity={0.7}
            zIndex={500}
            style={SELECTION_LAYER_STYLE}
            source={SELECTION_LAYER_SOURCE}
          />
          {
            <>
              {userPlaceGroups.map((placeGroup) => (
                <UserVectorLayer
                  key={placeGroup.id}
                  placeGroup={placeGroup}
                  mapProjection={mapProjection}
                  visible={
                    showUserPlaces && userPlaceGroupsVisibility[placeGroup.id]
                  }
                />
              ))}
            </>
          }
        </Layers>
        {placeGroupLayers}
        {/*<Select id='select' selectedFeaturesIds={selectedFeaturesId} onSelect={handleSelect}/>*/}
        <Draw
          id="drawPoint"
          layerId={USER_DRAWN_PLACE_GROUP_ID}
          active={mapInteraction === "Point"}
          type={"Point"}
          wrapX={true}
          stopClick={true}
          onDrawEnd={handleDrawEnd}
        />
        <Draw
          id="drawPolygon"
          layerId={USER_DRAWN_PLACE_GROUP_ID}
          active={mapInteraction === "Polygon"}
          type={"Polygon"}
          wrapX={true}
          stopClick={true}
          onDrawEnd={handleDrawEnd}
        />
        <Draw
          id="drawCircle"
          layerId={USER_DRAWN_PLACE_GROUP_ID}
          active={mapInteraction === "Circle"}
          type={"Circle"}
          wrapX={true}
          stopClick={true}
          onDrawEnd={handleDrawEnd}
        />
        {colorBarLegend}
        {colorBarLegend2}
        {mapPointInfoBox}
        {mapControlActions}
        {mapSplitter}
        {zoomBox}
        <ScaleLine bar={false} />
      </Map>
    </ErrorBoundary>
  );
}

function findFeatureById(
  map: OlMap,
  featureId: string | number,
): OlFeature | null {
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

function findNextLabel(
  userPlaceGroups: PlaceGroup[],
  mapInteraction: MapInteraction,
) {
  const nameBase = i18n.get(mapInteraction);
  const drawingPlaceGroup = userPlaceGroups.find(
    (pg) => pg.id === USER_DRAWN_PLACE_GROUP_ID,
  );
  if (drawingPlaceGroup) {
    for (let index = 1; ; index++) {
      const label = `${nameBase} ${index}`;
      const exists = !!drawingPlaceGroup!.features.find((p) => {
        if (!p.properties) {
          return false;
        }
        return p.properties!["label"] === label;
      });
      if (!exists) {
        return label;
      }
    }
  }
  return `${nameBase} 1`;
}

function setLayerClip(
  map: OlMap,
  event: RenderEvent,
  splitPos: number,
  side: 0 | 1,
) {
  const mapSize = map.getSize();
  if (!mapSize) {
    return;
  }

  const mapWidth = mapSize[0];
  const mapHeight = mapSize[1];

  let tl: Pixel, tr: Pixel, bl: Pixel, br: Pixel;
  if (side === 0) {
    tl = getRenderPixel(event, [0, 0]);
    tr = getRenderPixel(event, [splitPos, 0]);
    bl = getRenderPixel(event, [0, mapHeight]);
    br = getRenderPixel(event, [splitPos, mapHeight]);
  } else {
    tl = getRenderPixel(event, [splitPos, 0]);
    tr = getRenderPixel(event, [mapWidth, 0]);
    bl = getRenderPixel(event, [splitPos, mapHeight]);
    br = getRenderPixel(event, [mapWidth, mapHeight]);
  }

  const ctx = event.context as CanvasRenderingContext2D;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.closePath();
  ctx.clip();
}
