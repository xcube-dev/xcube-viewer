import * as React from 'react';
import * as geojson from 'geojson';
import * as ol from 'openlayers';

import { newId } from '../util/id';
import { MAP_OBJECTS } from "../states/controlState";
import { USER_PLACES_COLOR_NAMES } from "../config";
import ErrorBoundary from './ErrorBoundary';
import { Map, MapElement } from './ol/Map';
import { Layers } from './ol/layer/Layers';
import { View } from './ol/View';
import { Draw, DrawEvent } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';
import { OSMBlackAndWhite } from './ol/layer/Tile';
import { Control } from './ol/control/Control';


interface ViewerProps {
    drawMode?: ol.geom.GeometryType | null;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addGeometry?: (featureId: string, geometry: geojson.Geometry, color: string) => void;
    selectFeatures?: (features: geojson.Feature[]) => void;
    flyTo?: ol.geom.SimpleGeometry | ol.Extent | null;
}


const USER_LAYER_SOURCE = new ol.source.Vector();
const COLOR_LEGEND_STYLE: React.CSSProperties = {zIndex: 1000, left: 10, bottom: 65, position: 'relative'};


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
        const {addGeometry, drawMode} = this.props;
        if (this.map !== null && addGeometry && drawMode) {
            const feature = event.feature;
            const featureId = `Draw-${drawMode}-${newId()}`;
            const projection = this.map.getView().getProjection();
            const geometry = feature.clone().getGeometry().transform(projection, 'EPSG:4326');
            const geoJSONGeometry = new ol.format.GeoJSON().writeGeometryObject(geometry) as any;
            feature.setId(featureId);
            let colorIndex = 0;
            if (MAP_OBJECTS.userLayer) {
                const userLayer = MAP_OBJECTS.userLayer as ol.layer.Vector;
                const features = userLayer.getSource().getFeatures();
                colorIndex = features.length % USER_PLACES_COLOR_NAMES.length;
            }
            const color = USER_PLACES_COLOR_NAMES[colorIndex];
            if (drawMode === "Point") {
                feature.setStyle(createCircleStyle(7, color));
            }
            addGeometry(featureId, geoJSONGeometry as geojson.Geometry, color);
        }
        return true;
    };

    handleMapRef = (map: ol.Map | null) => {
        this.map = map;
    };

    componentDidUpdate(prevProps: Readonly<ViewerProps>, prevState: Readonly<{}>, snapshot?: any): void {
        let flyToCurr = this.props.flyTo || null;
        let flyToPrev = prevProps.flyTo || null;
        if (this.map !== null && flyToCurr !== null && flyToCurr !== flyToPrev) {
            const map = this.map;
            const projection = map.getView().getProjection();
            let flyToTarget;
            // noinspection JSDeprecatedSymbols
            if (Array.isArray(flyToCurr)) {
                flyToTarget = ol.proj.transformExtent(flyToCurr, 'EPSG:4326', projection);
            } else {
                flyToTarget = flyToCurr.transform('EPSG:4326', projection) as ol.geom.SimpleGeometry;
            }
            map.getView().fit(flyToTarget, {size: map.getSize()});
        }
    }

    public render() {
        const variableLayer = this.props.variableLayer;
        const placeGroupLayers = this.props.placeGroupLayers;
        const colorBarLegend = this.props.colorBarLegend;
        const drawMode = this.props.drawMode;
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
                >
                    <View id="view"/>
                    <Layers>
                        <OSMBlackAndWhite/>
                        {variableLayer}
                        <Vector id='userLayer' opacity={1} zIndex={500} source={USER_LAYER_SOURCE}/>
                    </Layers>
                    {placeGroupLayers}
                    {draw}
                    {colorBarControl}
                </Map>
            </ErrorBoundary>
        );
    }
}

export default Viewer;


function createCircleStyle(radius: number, fillColor: string, strokeColor: string = "white", strokeWidth: number = 1) {
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