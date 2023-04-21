/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import * as geojson from 'geojson';
import { default as OlMap } from 'ol/Map';
import { default as OlFeature } from 'ol/Feature';
import { default as OlGeoJSONFormat } from 'ol/format/GeoJSON';
import { default as OlCircleGeometry } from 'ol/geom/Circle';
import { fromCircle as olPolygonFromCircle } from 'ol/geom/Polygon';
import { default as OlVectorLayer } from 'ol/layer/Vector';
import { default as OlMapBrowserEvent } from 'ol/MapBrowserEvent';
import { default as OlVectorSource } from 'ol/source/Vector';
import { default as OlTileLayer } from 'ol/layer/Tile';
import { default as OlCircleStyle } from 'ol/style/Circle';
import { default as OlFillStyle } from 'ol/style/Fill';
import { default as OlStrokeStyle } from 'ol/style/Stroke';
import { default as OlStyle } from 'ol/style/Style';

import { Config, getUserPlaceColor, getUserPlaceColorName } from '../config';
import i18n from '../i18n';
import { Place, PlaceGroup, USER_DRAWING_PLACE_GROUP_ID, USER_ID_PREFIX } from '../model/place';
import { MAP_OBJECTS, MapInteraction } from '../states/controlState';
import { newId } from '../util/id';
import { GEOGRAPHIC_CRS } from '../model/proj';
import ErrorBoundary from './ErrorBoundary';
import { Control } from './ol/control/Control';
import { ScaleLine } from './ol/control/ScaleLine';
import { Draw, DrawEvent } from './ol/interaction/Draw';
import { Layers } from './ol/layer/Layers';
import { Vector } from './ol/layer/Vector';
import { Map, MapElement } from './ol/Map';
import { View } from './ol/View';
import { setFeatureStyle } from './ol/style';
import UserVectorLayer from "./UserVectorLayer";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles({});

const SELECTION_LAYER_ID = 'selection';
const SELECTION_LAYER_SOURCE = new OlVectorSource();

// TODO (forman): move all map styles into dedicated module, so settings will be easier to find & adjust

const COLOR_LEGEND_STYLE: React.CSSProperties = {zIndex: 1000, right: 272, top: 10};

const SELECTION_LAYER_STROKE = new OlStrokeStyle({
    color: [255, 200, 0, 1.0],
    width: 3
});
const SELECTION_LAYER_FILL = new OlFillStyle({
    color: [255, 200, 0, 0.05]
});
const SELECTION_LAYER_STYLE = new OlStyle({
    stroke: SELECTION_LAYER_STROKE,
    fill: SELECTION_LAYER_FILL,
    image: new OlCircleStyle({
        radius: 10,
        stroke: SELECTION_LAYER_STROKE,
        fill: SELECTION_LAYER_FILL,
    })
});


interface ViewerProps extends WithStyles<typeof styles> {
    theme: Theme;
    mapId: string;
    mapInteraction: MapInteraction;
    mapProjection: string;
    baseMapLayer?: MapElement;
    rgbLayer?: MapElement;
    variableLayer?: MapElement;
    datasetBoundaryLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addDrawnUserPlace?: (id: string, label: string, color: string, geometry: geojson.Geometry, selected: boolean) => void;
    userPlaceGroups: PlaceGroup[];
    userPlaceGroupsVisibility: {[pgId: string]: boolean};
    selectPlace?: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    selectedPlaceId?: string | null;
    places: Place[];
    imageSmoothing?: boolean;
    onMapRef: (map: OlMap | null) => void;
    importUserPlacesFromText?: (text: string) => any;
}

const Viewer: React.FC<ViewerProps> = (
    {
        theme,
        mapId,
        mapInteraction,
        mapProjection,
        baseMapLayer,
        rgbLayer,
        variableLayer,
        datasetBoundaryLayer,
        placeGroupLayers,
        colorBarLegend,
        addDrawnUserPlace,
        importUserPlacesFromText,
        userPlaceGroups,
        userPlaceGroupsVisibility,
        selectPlace,
        selectedPlaceId,
        places,
        imageSmoothing,
        onMapRef,
    }
) => {

    const [map, setMap] = useState<OlMap | null>(null);
    const [selectedPlaceIdPrev, setSelectedPlaceIdPrev] = useState<string | null>(selectedPlaceId || null);

    useEffect(() => {
        if (map) {
            const selectedPlaceIdCurr = selectedPlaceId || null;
            if (selectedPlaceIdCurr !== selectedPlaceIdPrev) {
                if (MAP_OBJECTS[SELECTION_LAYER_ID]) {
                    const selectionLayer = MAP_OBJECTS[SELECTION_LAYER_ID] as OlVectorLayer<OlVectorSource>;
                    const selectionSource = selectionLayer.getSource()!;
                    selectionSource.clear();
                    if (selectedPlaceIdCurr) {
                        const selectedFeature = findFeatureById(map, selectedPlaceIdCurr);
                        if (selectedFeature) {
                            // We clone features, so we can set a new ID and clear the style, so the selection
                            // layer style is used instead as default.
                            const displayFeature = selectedFeature.clone();
                            displayFeature.setId('select-' + selectedFeature.getId());
                            displayFeature.setStyle(undefined);
                            selectionSource.addFeature(displayFeature);
                        }
                    }
                    setSelectedPlaceIdPrev(selectedPlaceIdCurr);
                }
            }
        }
    }, [map, selectedPlaceId, selectedPlaceIdPrev]);

    useEffect(() => {
        // Force layer source updates after imageSmoothing change
        if (map) {
            map.getLayers().forEach(layer => {
                if (layer instanceof OlTileLayer) {
                    layer.getSource().changed();
                } else {
                    layer.changed();
                }
            });
        }
    }, [map, imageSmoothing]);

    const handleMapClick = (event: OlMapBrowserEvent<any>) => {
        if (mapInteraction === 'Select') {
            const map = event.map;
            let selectedPlaceId: string | null = null;
            const features = map.getFeaturesAtPixel(event.pixel);
            if (features) {
                for (let f of features) {
                    if (typeof f['getId'] === 'function') {
                        selectedPlaceId = f['getId']() + '';
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
        // TODO (forman): too much logic here! put the following code into an action + reducer.
        if (map !== null && addDrawnUserPlace && mapInteraction !== 'Select') {
            const feature = event.feature;
            let geometry = feature.getGeometry();
            if (!geometry) {
                return;
            }

            const placeId = newId(USER_ID_PREFIX + mapInteraction.toLowerCase() + "-");
            const projection = map.getView().getProjection();

            if (geometry instanceof OlCircleGeometry) {
                const polygon = olPolygonFromCircle(geometry as OlCircleGeometry);
                feature.setGeometry(polygon);
            }

            // Beware: transform() is an in-place op
            geometry = feature.clone().getGeometry()!.transform(projection, GEOGRAPHIC_CRS);
            const geoJSONGeometry = new OlGeoJSONFormat().writeGeometryObject(geometry) as any;
            feature.setId(placeId);
            let colorIndex = 0;
            if (MAP_OBJECTS[USER_DRAWING_PLACE_GROUP_ID]) {
                const userLayer = MAP_OBJECTS[USER_DRAWING_PLACE_GROUP_ID] as OlVectorLayer<OlVectorSource>;
                const features = userLayer?.getSource()?.getFeatures();
                if (features)
                    colorIndex = features.length;
            }
            const color = getUserPlaceColorName(colorIndex);
            const shadedColor = getUserPlaceColor(color, theme.palette.mode);
            setFeatureStyle(feature, shadedColor, Config.instance.branding.polygonFillOpacity);

            const nameBase = i18n.get(mapInteraction);
            let label: string = '';
            for (let index = 1; ; index++) {
                label = `${nameBase} ${index}`;
                // eslint-disable-next-line
                if (!userPlaceGroups[0].features.find(p => (p.properties || {})['label'] === label)) {
                    break;
                }
            }

            addDrawnUserPlace(placeId, label, color, geoJSONGeometry as geojson.Geometry, true);
        }
        return true;
    };

    function handleMapRef(map: OlMap | null) {
        if (onMapRef) {
            onMapRef(map);
        }
        setMap(map);
    }

    let colorBarControl = null;
    if (colorBarLegend) {
        colorBarControl = (
            <Control id="legend" style={COLOR_LEGEND_STYLE}>
                {colorBarLegend}
            </Control>
        );
    }

    // TODO (forman): fix me! this is a workaround to avoid that rgbLayer is never visible.
    if (rgbLayer !== null) {
        variableLayer = rgbLayer;
    }

    const handleDropFiles = (files: File[]) => {
        if (importUserPlacesFromText) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        importUserPlacesFromText(reader.result);
                    }
                };
                reader.readAsText(file, "UTF-8");
            });
        }
    };

    console.log("userPlaceGroups", userPlaceGroups)
    console.log("userPlaceGroupsVisibility", userPlaceGroupsVisibility)

    return (
        <ErrorBoundary>
            <Map
                id={mapId}
                onClick={(event) => handleMapClick(event)}
                onMapRef={handleMapRef}
                mapObjects={MAP_OBJECTS}
                isStale={true}
                onDropFiles={handleDropFiles}
            >
                <View id="view" projection={mapProjection}/>
                <Layers>
                    {baseMapLayer}
                    {variableLayer}
                    {datasetBoundaryLayer}
                    {<>{
                        userPlaceGroups.map(placeGroup => (
                            <UserVectorLayer
                                key={placeGroup.id}
                                placeGroup={placeGroup}
                                mapProjection={mapProjection}
                                visible={userPlaceGroupsVisibility[placeGroup.id]}
                            />
                        ))
                    }</>}
                    <Vector
                        id={SELECTION_LAYER_ID}
                        opacity={0.7}
                        zIndex={510}
                        style={SELECTION_LAYER_STYLE}
                        source={SELECTION_LAYER_SOURCE}
                    />
                </Layers>
                {placeGroupLayers}
                {/*<Select id='select' selectedFeaturesIds={selectedFeaturesId} onSelect={handleSelect}/>*/}
                <Draw
                    id="drawPoint"
                    layerId={USER_DRAWING_PLACE_GROUP_ID}
                    active={mapInteraction === 'Point'}
                    type={'Point'}
                    wrapX={true}
                    stopClick={true}
                    onDrawEnd={handleDrawEnd}
                />
                <Draw
                    id="drawPolygon"
                    layerId={USER_DRAWING_PLACE_GROUP_ID}
                    active={mapInteraction === 'Polygon'}
                    type={'Polygon'}
                    wrapX={true}
                    stopClick={true}
                    onDrawEnd={handleDrawEnd}
                />
                <Draw
                    id="drawCircle"
                    layerId={USER_DRAWING_PLACE_GROUP_ID}
                    active={mapInteraction === 'Circle'}
                    type={'Circle'}
                    wrapX={true}
                    stopClick={true}
                    onDrawEnd={handleDrawEnd}
                />
                {colorBarControl}
                <ScaleLine bar={false}/>
            </Map>
        </ErrorBoundary>
    );
};

export default withStyles(styles, {withTheme: true})(Viewer);


function findFeatureById(map: OlMap, featureId: string | number): OlFeature | null {
    for (let layer of map.getLayers().getArray()) {
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