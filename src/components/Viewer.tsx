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


interface ViewerProps {
    drawMode?: ol.geom.GeometryType | null;
    variableLayer?: MapElement;
    placeGroupLayers?: MapElement;
    colorBarLegend?: MapElement;
    addUserPlace?: (id: string, label: string, color: string, geometry: geojson.Geometry) => void;
    userPlaceGroup: PlaceGroup;
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
        const {addUserPlace, drawMode, userPlaceGroup} = this.props;
        if (this.map !== null && addUserPlace && drawMode) {
            const feature = event.feature;
            const placeId = `User-${drawMode}-${newId()}`;
            const projection = this.map.getView().getProjection();
            const geometry = feature.clone().getGeometry().transform(projection, 'EPSG:4326');
            const geoJSONGeometry = new ol.format.GeoJSON().writeGeometryObject(geometry) as any;
            feature.setId(placeId);
            let colorIndex = 0;
            if (MAP_OBJECTS.userLayer) {
                const userLayer = MAP_OBJECTS.userLayer as ol.layer.Vector;
                const features = userLayer.getSource().getFeatures();
                colorIndex = features.length % USER_PLACES_COLOR_NAMES.length;
            }
            const color = USER_PLACES_COLOR_NAMES[colorIndex];
            if (drawMode === 'Point') {
                feature.setStyle(createCircleStyle(7, color));
            }

            const nameBase = I18N.get(geoJSONGeometry.type);
            let label: string;
            for (let index = 1; ; index ++) {
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
                if (flyToTarget.getType() == 'Point') {
                    flyToTarget = transformPointExtent(flyToTarget, projection);
                }
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


function transformPointExtent(point: ol.geom.SimpleGeometry, projection: any): ol.Extent {
    const extent = point.getExtent();
    switch (projection.getUnits()) {
        case 'degrees':
            extent[0] -= 0.01;
            extent[1] -= 0.01;
            extent[2] += 0.01;
            extent[3] += 0.01;
            break;
        case 'm': {
            extent[0] -= 1000;
            extent[1] -= 1000;
            extent[2] += 1000;
            extent[3] += 1000;
            break;
        }
    }
    return extent;
}

