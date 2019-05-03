import * as React from 'react';
import * as geojson from 'geojson';

import ErrorBoundary from './ErrorBoundary';
import { Map, MapElement } from './ol/Map';
import { Layers } from './ol/layer/Layers';
import { View } from './ol/View';
import * as ol from 'openlayers';
import { Draw, DrawEvent } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';
import { OSMBlackAndWhite } from './ol/layer/Tile';
import { Control } from './ol/control/Control';
import { newId } from '../util/id';


interface ViewerProps {
    drawMode?: ol.geom.GeometryType | null;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addGeometry?: (featureId: string, geometry: geojson.Geometry) => void;
    selectFeatures?: (features: geojson.Feature[]) => void;
    flyTo?: ol.geom.SimpleGeometry | ol.Extent | null;
    setMap?: (map: ol.Map | null) => void;
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
            feature.setId(featureId);
            const projection = this.map.getView().getProjection();
            const geometry = feature.clone().getGeometry().transform(projection, 'EPSG:4326');
            const geoJSONGeometry = new ol.format.GeoJSON().writeGeometryObject(geometry) as any;
            addGeometry(featureId, geoJSONGeometry as geojson.Geometry);
        }
        return true;
    };

    handleMapRef = (map: ol.Map | null) => {
        this.map = map;
        if (this.props.setMap) {
            this.props.setMap(map);
        }
    };

    componentDidUpdate(prevProps: Readonly<ViewerProps>, prevState: Readonly<{}>, snapshot?: any): void {
        let flyToCurr = this.props.flyTo || null;
        let flyToPrev = prevProps.flyTo || null;
        if (this.map !== null && flyToCurr !== null && flyToCurr !== flyToPrev) {
            const map = this.map;
            const projection = map.getView().getProjection();
            let flyToTarget;
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
                         layerId={'user'}
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
                <Map onClick={this.handleMapClick} onMapRef={this.handleMapRef}>
                    <View id="view"/>
                    <Layers>
                        <OSMBlackAndWhite/>
                        {variableLayer}
                        <Vector id={'user'} opacity={1} zIndex={500} source={USER_LAYER_SOURCE}/>
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
