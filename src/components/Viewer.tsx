import * as React from 'react';
import * as GeoJSON from 'geojson';

import ErrorBoundary from './ErrorBoundary';
import { Map } from './ol/Map';
import { Layers, LayerElement } from './ol/layer/Layers';
import { OSM } from './ol/layer/OSM';
import { View } from './ol/View';
import * as ol from 'openlayers';
import { Draw } from './ol/interaction/Draw';
import { Vector } from './ol/layer/Vector';


interface ViewerProps {
    drawMode?: ol.geom.GeometryType | null;
    variableLayer?: LayerElement;
    selectCoordinate?: (geoCoordinate: [number, number]) => void;
    selectFeatures?: (features: GeoJSON.Feature[]) => void;
    flyTo?: ol.geom.SimpleGeometry | ol.Extent | null;
}

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
        let {variableLayer, drawMode} = this.props;
        let draw = drawMode ? <Draw layerId={'user'} type={drawMode}/> : null;
        return (
            <ErrorBoundary>
                <Map onClick={this.handleMapClick} onMapRef={this.handleMapRef}>
                    <View/>
                    <Layers>
                        <OSM/>
                        {variableLayer}
                        <Vector id={'user'} layerOptions={{opacity: 1, zIndex: 500}}/>
                    </Layers>
                    {draw}
                </Map>
            </ErrorBoundary>
        );
    }
}

export default Viewer;
