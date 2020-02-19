import * as React from 'react';
import { useEffect, useState } from 'react';
import * as geojson from 'geojson';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { default as OlMap } from 'ol/Map';
import { default as OlMapBrowserEvent } from 'ol/MapBrowserEvent';
import { default as OlGeoJSONFormat } from 'ol/format/GeoJSON';
import { default as OlVectorLayer } from 'ol/layer/Vector';
import { default as OlVectorSource } from 'ol/source/Vector';
import { default as OlGeometryType } from 'ol/geom/GeometryType';
import { default as OlCircleGeometry } from 'ol/geom/Circle';
import { default as OlFeature } from 'ol/Feature';
import { default as OlStyle } from 'ol/style/Style';
import { default as OlFillStyle } from 'ol/style/Fill';
import { default as OlStrokeStyle } from 'ol/style/Stroke';
import { default as OlCircleStyle } from 'ol/style/Circle';
import { Color as OlColor } from 'ol/color';
import { fromCircle as olPolygonFromCircle } from 'ol/geom/Polygon';

import { newId } from '../util/id';
import { Place, PlaceGroup } from '../model/place';
import { MAP_OBJECTS, MapInteraction } from '../states/controlState';
import { getUserPlaceColor, getUserPlaceColorName, I18N } from '../config';
import ErrorBoundary from './ErrorBoundary';
import { Map, MapElement } from './ol/Map';
import { Layers } from './ol/layer/Layers';
import { View } from './ol/View';
import { Draw, DrawEvent } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';
import { Control } from './ol/control/Control';
import { ScaleLine } from './ol/control/ScaleLine';

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles({});

// TODO (forman): no good design, store in some state instead:
const USER_LAYER_SOURCE = new OlVectorSource();
const SELECTION_LAYER_SOURCE = new OlVectorSource();


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
    baseMapLayer?: MapElement;
    rgbLayer?: MapElement;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addUserPlace?: (id: string, label: string, color: string, geometry: geojson.Geometry) => void;
    userPlaceGroup: PlaceGroup;
    selectPlace?: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    selectedPlaceId?: string | null;
    places: Place[];
}

const Viewer: React.FC<ViewerProps> = ({
                                           theme,
                                           mapId,
                                           mapInteraction,
                                           baseMapLayer,
                                           rgbLayer,
                                           variableLayer,
                                           placeGroupLayers,
                                           colorBarLegend,
                                           addUserPlace,
                                           userPlaceGroup,
                                           selectPlace,
                                           selectedPlaceId,
                                           places,
                                       }) => {

    const [map, setMap] = useState<OlMap | null>(null);
    const [selectedPlaceIdPrev, setSelectedPlaceIdPrev] = useState<string | null>(selectedPlaceId || null);

    useEffect(() => {
        if (map) {
            const selectedPlaceIdCurr = selectedPlaceId || null;
            if (selectedPlaceIdCurr !== selectedPlaceIdPrev) {
                SELECTION_LAYER_SOURCE.clear();
                if (selectedPlaceIdCurr) {
                    const selectedFeature = findFeatureById(map, selectedPlaceIdCurr);
                    if (selectedFeature) {
                        // We clone so feature so we can set a new ID and clear the style, so the selection
                        // layer style is used instead as default.
                        const displayFeature = selectedFeature.clone();
                        displayFeature.setId('Select-' + selectedFeature.getId());
                        displayFeature.setStyle(null);
                        SELECTION_LAYER_SOURCE.addFeature(displayFeature);
                    }
                }
                setSelectedPlaceIdPrev(selectedPlaceIdCurr);
            }
        }
    }, [map, selectedPlaceId, selectedPlaceIdPrev]);

    const handleMapClick = (event: OlMapBrowserEvent) => {
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
        if (map !== null && addUserPlace && mapInteraction !== 'Select') {
            const feature = event.feature;
            let geometry = feature.getGeometry();
            if (!geometry) {
                return;
            }

            const placeId = `User-${mapInteraction}-${newId()}`;
            const projection = map.getView().getProjection();

            if (geometry instanceof OlCircleGeometry) {
                const polygon = olPolygonFromCircle(geometry as OlCircleGeometry);
                feature.setGeometry(polygon);
            }

            // Beware: transform() is an in-place op
            geometry = feature.clone().getGeometry()!.transform(projection, 'EPSG:4326');
            const geoJSONGeometry = new OlGeoJSONFormat().writeGeometryObject(geometry) as any;
            feature.setId(placeId);
            let colorIndex = 0;
            if (MAP_OBJECTS.userLayer) {
                const features = USER_LAYER_SOURCE.getFeatures();
                colorIndex = features.length;
            }
            const color = getUserPlaceColorName(colorIndex);
            const shadedColor = getUserPlaceColor(color, theme.palette.type);
            if (mapInteraction === 'Point') {
                feature.setStyle(createPointGeometryStyle(7, shadedColor, 'white', 1));
            } else {
                feature.setStyle(createGeometryStyle([255, 255, 255, 0.25], shadedColor, 2));
            }

            const nameBase = I18N.get(mapInteraction);
            let label: string = '';
            for (let index = 1; ; index++) {
                label = `${nameBase} ${index}`;
                // eslint-disable-next-line
                if (!userPlaceGroup.features.find(p => (p.properties || {})['label'] === label)) {
                    break;
                }
            }

            addUserPlace(placeId, label, color, geoJSONGeometry as geojson.Geometry);
        }
        return true;
    };

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

    return (
        <ErrorBoundary>
            <Map
                id={mapId}
                onClick={(event) => handleMapClick(event)}
                onMapRef={setMap}
                mapObjects={MAP_OBJECTS}
                isStale={true}
            >
                <View id="view"/>
                <Layers>
                    {baseMapLayer}
                    {variableLayer}
                    <Vector id='userLayer' opacity={1} zIndex={500}
                            source={USER_LAYER_SOURCE}/>
                    <Vector id='selectionLayer' opacity={0.7} zIndex={510} style={SELECTION_LAYER_STYLE}
                            source={SELECTION_LAYER_SOURCE}/>
                </Layers>
                {placeGroupLayers}
                {/*<Select id='select' selectedFeaturesIds={selectedFeaturesId} onSelect={handleSelect}/>*/}
                <Draw
                    id="drawPoint"
                    layerId={'userLayer'}
                    active={mapInteraction === 'Point'}
                    type={OlGeometryType.POINT}
                    wrapX={true}
                    stopClick={true}
                    onDrawEnd={handleDrawEnd}
                />
                <Draw
                    id="drawPolygon"
                    layerId={'userLayer'}
                    active={mapInteraction === 'Polygon'}
                    type={OlGeometryType.POLYGON}
                    wrapX={true}
                    stopClick={true}
                    onDrawEnd={handleDrawEnd}
                />
                <Draw
                    id="drawCircle"
                    layerId={'userLayer'}
                    active={mapInteraction === 'Circle'}
                    type={OlGeometryType.CIRCLE}
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


function createPointGeometryStyle(radius: number, fillColor: string, strokeColor: string, strokeWidth: number): OlStyle {
    let fill = new OlFillStyle(
        {
            color: fillColor,
        });
    let stroke = new OlStrokeStyle(
        {
            color: strokeColor,
            width: strokeWidth,
        }
    );
    return new OlStyle(
        {
            image: new OlCircleStyle({radius, fill, stroke})
        }
    );
}

function createGeometryStyle(fillColor: string | OlColor, strokeColor: string | OlColor, strokeWidth: number): OlStyle {
    const fill = new OlFillStyle(
        {
            color: fillColor,
        });
    const stroke = new OlStrokeStyle(
        {
            color: strokeColor,
            width: strokeWidth,

        }
    );
    return new OlStyle({fill, stroke});
}

function findFeatureById(map: OlMap, featureId: string | number): OlFeature | null {
    for (let layer of map.getLayers().getArray()) {
        if (layer instanceof OlVectorLayer) {
            const vectorLayer = layer as OlVectorLayer;
            const feature = vectorLayer.getSource().getFeatureById(featureId);
            if (feature) {
                return feature;
            }
        }
    }
    return null;
}