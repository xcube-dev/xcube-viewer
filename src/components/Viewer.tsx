import * as React from 'react';
import * as GeoJSON from 'geojson';

import ErrorBoundary from './ErrorBoundary';
import { Map } from './ol/Map';
import { Layers, LayerElement } from './ol/layer/Layers';
import { OSM } from './ol/layer/OSM';
import { View } from "./ol/View";
import * as ol from "openlayers";


interface ViewerProps {
    variableLayer?: LayerElement;
    selectCoordinate?: (geoCoordinate: [number, number]) => void;
    selectFeatures?: (features: GeoJSON.Feature[]) => void;
}

class Viewer extends React.Component<ViewerProps> {

    handleMapClick = (event: ol.MapBrowserEvent) => {
        const {selectCoordinate, selectFeatures} = this.props;

        const map = event.map;
        const mapCoordinate = map.getCoordinateFromPixel(event.pixel);
        const geoCoordinate = ol.proj.transform(mapCoordinate, map.getView().getProjection(), 'EPSG:4326');

        if (selectCoordinate) {
            selectCoordinate(geoCoordinate);
        }

        if (selectFeatures) {
            map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                console.log("Map.handleClick: feature is near: ", feature, layer);
            });
            // selectFeature(features);
        }
    };

    public render() {
        let {variableLayer} = this.props;
        return (
            <ErrorBoundary>
                <Map onClick={this.handleMapClick}>
                    <View/>
                    <Layers>
                        <OSM/>
                        {variableLayer}
                    </Layers>
                </Map>
            </ErrorBoundary>
        );
    }
}

export default Viewer;
