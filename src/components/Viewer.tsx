import * as React from 'react';
import * as GeoJSON from 'geojson';

import ErrorBoundary from './ErrorBoundary';
import { Map, MapElement } from './ol/Map';
import { Layers } from './ol/layer/Layers';
import { View } from './ol/View';
import * as ol from 'openlayers';
import { Draw } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';
import { OSMBlackAndWhite } from "./ol/layer/Tile";
import { Control } from './ol/control/Control';


interface ViewerProps {
    drawMode?: ol.geom.GeometryType | null;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    selectCoordinate?: (geoCoordinate: [number, number]) => void;
    selectFeatures?: (features: GeoJSON.Feature[]) => void;
    flyTo?: ol.geom.SimpleGeometry | ol.Extent | null;
}


const USER_LAYER_SOURCE = new ol.source.Vector();
const COLOR_LEGEND_STYLE: React.CSSProperties = {zIndex: 1000, left: 10, bottom: 65, position: 'relative'};


class Viewer extends React.Component<ViewerProps> {

    map: ol.Map | null;

    handleMapClick = (event: ol.MapBrowserEvent) => {
        const {selectCoordinate, selectFeatures} = this.props;

        const map = event.map;
        const mapCoordinate = map.getCoordinateFromPixel(event.pixel);
        const geoCoordinate = ol.proj.transform(mapCoordinate, map.getView().getProjection(), 'EPSG:4326');

        if (selectCoordinate) {
            selectCoordinate(geoCoordinate);
        }

        if (selectFeatures) {
            // noinspection JSUnusedLocalSymbols
            map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                // console.log("Map.handleClick: feature is near: ", feature, layer);
            });
            // selectFeature(features);
        }
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
        const draw = drawMode ? <Draw id="draw" layerId={'user'} type={drawMode}/> : null;

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
