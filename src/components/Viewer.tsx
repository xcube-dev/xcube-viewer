import * as React from 'react';
import * as geojson from 'geojson';
import * as ol from 'openlayers';
import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core/styles";

import { newId } from '../util/id';
import { Place, PlaceGroup } from '../model/place';
import { MAP_OBJECTS, MapInteraction } from '../states/controlState';
import {
    I18N,
    LINE_CHART_STROKE_SHADE_DARK_THEME,
    LINE_CHART_STROKE_SHADE_LIGHT_THEME,
    USER_PLACES_COLOR_NAMES, USER_PLACES_COLORS
} from '../config';
import ErrorBoundary from './ErrorBoundary';
import { Map, MapElement } from './ol/Map';
import { Layers } from './ol/layer/Layers';
import { View } from './ol/View';
import { Draw, DrawEvent } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';
import { OSMBlackAndWhite } from './ol/layer/Tile';
import { Control } from './ol/control/Control';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles({});

// TODO (forman): no good design, store in some state instead:
const USER_LAYER_SOURCE = new ol.source.Vector();
const SELECTION_LAYER_SOURCE = new ol.source.Vector();


const COLOR_LEGEND_STYLE: React.CSSProperties = {zIndex: 1000, left: 10, bottom: 65, position: 'relative'};

const SELECTION_LAYER_STROKE = new ol.style.Stroke({
                                                       color: [255, 200, 0, 1.0],
                                                       width: 3
                                                   });
const SELECTION_LAYER_FILL = new ol.style.Fill({
                                                   color: [255, 200, 0, 0.05]
                                               });
const SELECTION_LAYER_STYLE = new ol.style.Style({
                                                     stroke: SELECTION_LAYER_STROKE,
                                                     fill: SELECTION_LAYER_FILL,
                                                     image: new ol.style.Circle({
                                                                                    radius: 10,
                                                                                    stroke: SELECTION_LAYER_STROKE,
                                                                                    fill: SELECTION_LAYER_FILL,
                                                                                })
                                                 });


interface ViewerProps extends WithStyles<typeof styles> {
    theme: Theme;
    mapInteraction: MapInteraction;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addUserPlace?: (id: string, label: string, color: string, geometry: geojson.Geometry) => void;
    userPlaceGroup: PlaceGroup;
    selectPlace?: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    selectedPlaceId?: string | null;
    flyTo?: ol.geom.SimpleGeometry | ol.Extent | null;
    places: Place[];
}

class Viewer extends React.Component<ViewerProps> {

    map: ol.Map | null;

    handleMapClick = (event: ol.MapBrowserEvent) => {
        const {selectPlace, mapInteraction, places} = this.props;
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

    handleDrawEnd = (event: DrawEvent) => {
        const {theme, addUserPlace, mapInteraction, userPlaceGroup} = this.props;
        // TODO (forman): too much logic here! put the following code into an action + reducer.
        if (this.map !== null && addUserPlace && mapInteraction !== 'Select') {
            const feature = event.feature;
            const placeId = `User-${mapInteraction}-${newId()}`;
            const projection = this.map.getView().getProjection();

            if (feature.getGeometry() instanceof ol.geom.Circle) {
                const polygon = ol.geom.Polygon.fromCircle(feature.getGeometry() as ol.geom.Circle);
                feature.setGeometry(polygon);
            }

            // Beware: transform() is an in-place op
            const geometry = feature.clone().getGeometry().transform(projection, 'EPSG:4326');
            const geoJSONGeometry = new ol.format.GeoJSON().writeGeometryObject(geometry) as any;
            feature.setId(placeId);
            let colorIndex = 0;
            if (MAP_OBJECTS.userLayer) {
                const features = USER_LAYER_SOURCE.getFeatures();
                colorIndex = features.length % USER_PLACES_COLOR_NAMES.length;
            }
            const strokeShade = theme.palette.type === 'light' ? LINE_CHART_STROKE_SHADE_LIGHT_THEME : LINE_CHART_STROKE_SHADE_DARK_THEME;
            const color = USER_PLACES_COLOR_NAMES[colorIndex];
            const shadedColor = USER_PLACES_COLORS[color][strokeShade];
            if (mapInteraction === 'Point') {
                feature.setStyle(createPointGeometryStyle(7, shadedColor, 'white', 1));
            } else {
                feature.setStyle(createGeometryStyle([255, 255, 255, 0.25], shadedColor, 2));
            }

            const nameBase = I18N.get(mapInteraction);
            let label: string;
            for (let index = 1; ; index++) {
                label = `${nameBase} ${index}`;
                if (!userPlaceGroup.features.find(p => (p.properties || {})['label'] === label)) {
                    break;
                }
            }

            addUserPlace(placeId, label, color, geoJSONGeometry as geojson.Geometry);
        }
        return true;
    };

    handleMapRef = (map: ol.Map | null) => {
        this.map = map;
    };

    componentDidUpdate(prevProps: Readonly<ViewerProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.map === null) {
            return;
        }
        const map = this.map!;

        const flyToCurr = this.props.flyTo || null;
        const flyToPrev = prevProps.flyTo || null;
        if (flyToCurr !== null && flyToCurr !== flyToPrev) {
            // TODO (forman): too much logic here! put the following code into selector(s) and pass stuff as props.
            const projection = map.getView().getProjection();
            let flyToTarget;
            // noinspection JSDeprecatedSymbols
            if (Array.isArray(flyToCurr)) {
                // Fly to extent (bounding box)
                flyToTarget = ol.proj.transformExtent(flyToCurr, 'EPSG:4326', projection);
                map.getView().fit(flyToTarget, {size: map.getSize()});
            } else {
                // Transform Geometry object
                flyToTarget = flyToCurr.transform('EPSG:4326', projection) as ol.geom.SimpleGeometry;
                if (flyToTarget.getType() == 'Point') {
                    // Points don't fly. Just reset map center. Not ideal, but better than zooming in too deep (see #54)
                    map.getView().setCenter(flyToTarget.getFirstCoordinate());
                } else {
                    // Fly to shape
                    map.getView().fit(flyToTarget, {size: map.getSize()});
                }
            }
        }

        const selectedPlaceIdCurr = this.props.selectedPlaceId;
        const selectedPlaceIdPrev = prevProps.selectedPlaceId;
        if (selectedPlaceIdCurr !== selectedPlaceIdPrev) {
            SELECTION_LAYER_SOURCE.clear();
            if (selectedPlaceIdCurr) {
                const selectedFeature = findFeatureById(this.map!, selectedPlaceIdCurr);
                if (selectedFeature) {
                    // We clone so feature so we can set a new ID and clear the style, so the selection
                    // layer style is used instead as default.
                    const displayFeature = selectedFeature.clone();
                    displayFeature.setId('Select-' + selectedFeature.getId());
                    displayFeature.setStyle(null);
                    SELECTION_LAYER_SOURCE.addFeature(displayFeature);
                }
            }
        }
    }

    public render() {
        const {variableLayer, placeGroupLayers, colorBarLegend, mapInteraction} = this.props;

        let colorBarControl = null;
        if (colorBarLegend) {
            colorBarControl = (
                <Control id="legend" style={COLOR_LEGEND_STYLE}>
                    {colorBarLegend}
                </Control>
            );
        }

        return (
            <ErrorBoundary>
                <Map
                    id="map"
                    onClick={this.handleMapClick}
                    onMapRef={this.handleMapRef}
                    mapObjects={MAP_OBJECTS}
                    isStale={true}
                >
                    <View id="view"/>
                    <Layers>
                        <OSMBlackAndWhite/>
                        {variableLayer}
                        <Vector id='userLayer' opacity={1} zIndex={500} source={USER_LAYER_SOURCE}/>
                        <Vector id='selectionLayer' opacity={0.7} zIndex={510} style={SELECTION_LAYER_STYLE}
                                source={SELECTION_LAYER_SOURCE}/>
                    </Layers>
                    {placeGroupLayers}
                    {/*<Select id='select' selectedFeaturesIds={selectedFeaturesId} onSelect={this.handleSelect}/>*/}
                    <Draw
                        id="drawPoint"
                        layerId={'userLayer'}
                        active={mapInteraction === 'Point'}
                        type={'Point'}
                        wrapX={true}
                        stopClick={true}
                        onDrawEnd={this.handleDrawEnd}
                    />
                    <Draw
                        id="drawPolygon"
                        layerId={'userLayer'}
                        active={mapInteraction === 'Polygon'}
                        type={'Polygon'}
                        wrapX={true}
                        stopClick={true}
                        onDrawEnd={this.handleDrawEnd}
                    />
                    <Draw
                        id="drawCircle"
                        layerId={'userLayer'}
                        active={mapInteraction === 'Circle'}
                        type={'Circle'}
                        wrapX={true}
                        stopClick={true}
                        onDrawEnd={this.handleDrawEnd}
                    />
                    {colorBarControl}
                </Map>
            </ErrorBoundary>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Viewer);


function createPointGeometryStyle(radius: number, fillColor: string, strokeColor: string, strokeWidth: number): ol.style.Style {
    let fill = new ol.style.Fill(
        {
            color: fillColor,
        });
    let stroke = new ol.style.Stroke(
        {
            color: strokeColor,
            width: strokeWidth,
        }
    );
    return new ol.style.Style(
        {
            image: new ol.style.Circle({radius, fill, stroke})
        }
    );
}

function createGeometryStyle(fillColor: string | ol.Color, strokeColor: string | ol.Color, strokeWidth: number): ol.style.Style {
    const fill = new ol.style.Fill(
        {
            color: fillColor,
        });
    const stroke = new ol.style.Stroke(
        {
            color: strokeColor,
            width: strokeWidth,

        }
    );
    return new ol.style.Style({fill, stroke});
}

function findFeatureById(map: ol.Map, featureId: string | number): ol.Feature | null {
    for (let layer of map.getLayers().getArray()) {
        if (layer instanceof ol.layer.Vector) {
            const vectorLayer = layer as ol.layer.Vector;
            const feature = vectorLayer.getSource().getFeatureById(featureId);
            if (feature) {
                return feature;
            }
        }
    }
    return null;
}