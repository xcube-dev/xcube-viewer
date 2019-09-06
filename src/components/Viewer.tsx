import * as React from 'react';
import * as geojson from 'geojson';
import * as ol from 'openlayers';

import { newId } from '../util/id';
import { PlaceGroup } from '../model/place';
import { MAP_OBJECTS } from '../states/controlState';
import { I18N, USER_PLACES_COLOR_NAMES } from '../config';
import ErrorBoundary from './ErrorBoundary';
import { Map, MapElement } from './ol/Map';
import { Layers } from './ol/layer/Layers';
import { View } from './ol/View';
import { Draw, DrawEvent } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';
import { OSMBlackAndWhite } from './ol/layer/Tile';
import { Control } from './ol/control/Control';
// import { Select, SelectEvent } from './ol/interaction/Select';


interface ViewerProps {
    drawMode?: ol.geom.GeometryType | null;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addUserPlace?: (id: string, label: string, color: string, geometry: geojson.Geometry) => void;
    userPlaceGroup: PlaceGroup;
    selectFeatures?: (features: geojson.Feature[]) => void;
    selectedPlaceId?: string | null;
    flyTo?: ol.geom.SimpleGeometry | ol.Extent | null;
}

// TODO (forman): argh! no good design, store in some state instead
const USER_LAYER_SOURCE = new ol.source.Vector();
const SELECTION_LAYER_SOURCE = new ol.source.Vector();
const COLOR_LEGEND_STYLE: React.CSSProperties = {zIndex: 1000, left: 10, bottom: 65, position: 'relative'};

const SELECTION_LAYER_STROKE = new ol.style.Stroke({
                                                       color: [255, 200, 0, 1.0],
                                                       width: 3
                                                   });
const SELECTION_LAYER_FILL = new ol.style.Fill({
                                                   color: [255, 200, 0, 0.1]
                                               });
const SELECTION_LAYER_STYLE = new ol.style.Style({
                                                     stroke: SELECTION_LAYER_STROKE,
                                                     fill: SELECTION_LAYER_FILL,
                                                     image: new ol.style.Circle({
                                                                                    radius: 16,
                                                                                    stroke: SELECTION_LAYER_STROKE,
                                                                                    fill: SELECTION_LAYER_FILL,
                                                                                })
                                                 });


class Viewer extends React.Component<ViewerProps> {

    map: ol.Map | null;

    handleMapClick = (event: ol.MapBrowserEvent) => {
        const {selectFeatures, drawMode} = this.props;
        if (selectFeatures && drawMode === null) {
            const map = event.map;
            // noinspection JSUnusedLocalSymbols
            map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                console.log('Map.handleClick: feature is near: ', feature, layer);
            });
            // selectFeature(features);
        }
    };

    handleDrawEnd = (event: DrawEvent) => {
        const {addUserPlace, drawMode, userPlaceGroup} = this.props;
        // TODO (forman): too much logic here! put the following code into an action + reducer.
        if (this.map !== null && addUserPlace && drawMode) {
            const feature = event.feature;
            const placeId = `User-${drawMode}-${newId()}`;
            const projection = this.map.getView().getProjection();
            const geometry = feature.clone().getGeometry().transform(projection, 'EPSG:4326');
            const geoJSONGeometry = new ol.format.GeoJSON().writeGeometryObject(geometry) as any;
            feature.setId(placeId);
            let colorIndex = 0;
            if (MAP_OBJECTS.userLayer) {
                const features = USER_LAYER_SOURCE.getFeatures();
                colorIndex = features.length % USER_PLACES_COLOR_NAMES.length;
            }
            const color = USER_PLACES_COLOR_NAMES[colorIndex];
            if (drawMode === 'Point') {
                feature.setStyle(createCircleStyle(7, color));
            }

            console.log('new feature: ', feature.getId(), feature.getProperties());

            const nameBase = I18N.get(geoJSONGeometry.type);
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

    // handleSelect = (event: SelectEvent) => {
    //     console.log('handleSelect: ', event);
    // };

    handleMapRef = (map: ol.Map | null) => {
        this.map = map;
    };

    componentDidUpdate(prevProps: Readonly<ViewerProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.map === null) {
            return;
        }
        const map = this.map!;
        let flyToCurr = this.props.flyTo || null;
        let flyToPrev = prevProps.flyTo || null;
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
        console.log('Viewer.componentDidUpdate: selectedPlaceId =', selectedPlaceIdCurr);
        if (selectedPlaceIdCurr !== selectedPlaceIdPrev) {
            SELECTION_LAYER_SOURCE.clear();
            if (selectedPlaceIdCurr) {
                const selectedFeature = findFeatureById(this.map!, selectedPlaceIdCurr);
                console.log("Viewer.componentDidUpdate: ", selectedFeature);
                if (selectedFeature) {
                    SELECTION_LAYER_SOURCE.addFeature(selectedFeature);
                }
            }
        }
    }

    public render() {
        const {variableLayer, placeGroupLayers, colorBarLegend} = this.props;
        const drawMode = this.props.drawMode;
        // const drawMode = false;
        const draw = drawMode ?
                     <Draw
                         id="draw"
                         layerId={'userLayer'}
                         type={drawMode}
                         wrapX={true}
                         stopClick={true}
                         onDrawEnd={this.handleDrawEnd}
                     /> : null;

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
                        <Vector id='selectionLayer' opacity={0.7} zIndex={510} style={SELECTION_LAYER_STYLE} source={SELECTION_LAYER_SOURCE}/>
                    </Layers>
                    {placeGroupLayers}
                    {/*<Select id='select' selectedFeaturesIds={selectedFeaturesId} onSelect={this.handleSelect}/>*/}
                    {draw}
                    {colorBarControl}
                </Map>
            </ErrorBoundary>
        );
    }
}

export default Viewer;


function createCircleStyle(radius: number, fillColor: string, strokeColor: string = 'white', strokeWidth: number = 1) {
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