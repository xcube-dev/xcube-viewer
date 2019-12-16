import * as React from 'react';
import { default as OlMap } from 'ol/Map';
import { default as OlTileLayer } from 'ol/layer/Tile';
import { default as OlXYZSource } from 'ol/source/XYZ';
import { default as OlOSMSource } from 'ol/source/OSM';
import { Options as OlTileLayerOptions } from 'ol/layer/Tile';

import { MapComponent, MapComponentProps } from '../MapComponent';


// noinspection JSUnusedGlobalSymbols
export function NaturalEarth2(): JSX.Element {
    return <Tile id={'NaturalEarth2'} source={NATURAL_EARTH_2_SOURCE}/>;
}

// noinspection JSUnusedGlobalSymbols
export function Bathymetry(): JSX.Element {
    return <Tile id={'Bathymetry'} source={BATHYMETRY_SOURCE}/>;
}

// noinspection JSUnusedGlobalSymbols
export function OSM(): JSX.Element {
    return <Tile id={'OSM'} source={OSM_SOURCE}/>;
}

// noinspection JSUnusedGlobalSymbols
export function OSMBlackAndWhite(): JSX.Element {
    return <Tile id={'OSMBW'} source={OSM_BW_SOURCE}/>;
}


interface TileProps extends MapComponentProps, OlTileLayerOptions {
}

export class Tile extends MapComponent<OlTileLayer, TileProps> {

    addMapObject(map: OlMap): OlTileLayer {
        const layer = new OlTileLayer(this.props);
        map.getLayers().push(layer);
        return layer;
    }

    updateMapObject(map: OlMap, layer: OlTileLayer, prevProps: Readonly<TileProps>): OlTileLayer {
        // TODO: Code duplication in ./Vector.tsx
        if (this.props.source !== prevProps.source && this.props.source) {
            layer.setSource(this.props.source);
        }
        if (this.props.visible && this.props.visible !== prevProps.visible) {
            layer.setVisible(this.props.visible);
        }
        if (this.props.opacity && this.props.opacity !== prevProps.opacity) {
            layer.setOpacity(this.props.opacity);
        }
        if (this.props.zIndex && this.props.zIndex !== prevProps.zIndex) {
            layer.setZIndex(this.props.zIndex);
        }
        if (this.props.minResolution && this.props.minResolution !== prevProps.minResolution) {
            layer.setMinResolution(this.props.minResolution);
        }
        if (this.props.maxResolution && this.props.maxResolution !== prevProps.maxResolution) {
            layer.setMaxResolution(this.props.maxResolution);
        }
        // TODO: add more props here
        return layer;
    }

    removeMapObject(map: OlMap, layer: OlTileLayer): void {
        map.getLayers().remove(layer);
    }
}

const NATURAL_EARTH_2_SOURCE = new OlXYZSource(
    {
        url: 'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png',
        attributions: [
            '&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>',
            '&copy; <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors',
        ],
    });

const BATHYMETRY_SOURCE = new OlXYZSource(
    {
        url: 'https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}',
        attributions: [
            '&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>',
            '&copy; <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors',
        ]
    });

const OSM_SOURCE = new OlOSMSource();

const OSM_BW_SOURCE = new OlXYZSource(
    {
        url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
        attributions: [
            '&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors',
        ]
    });

