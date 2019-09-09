import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

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


interface TileProps extends MapComponentProps, olx.layer.TileOptions {
}

export class Tile extends MapComponent<ol.layer.Tile, TileProps> {

    addMapObject(map: ol.Map): ol.layer.Tile {
        const layer = new ol.layer.Tile(this.props);

        // TODO (forman): Issue #86: The following is an attempt to avoid image smoothing
        //                so crisp image pixels are drawn. But it still doesn't work.
        // See https://stackoverflow.com/questions/54083424/preventing-smoothing-of-tileimage-layer
        // See https://stackoverflow.com/questions/35875270/turn-off-image-smoothing-in-openlayers-3
        // See https://openlayers.org/en/latest/examples/layer-spy.html
        //
        layer.on('precompose', (event: any) => {
            const ctx = event.context as any; // CanvasRenderingContext2D;
            ctx.save();
            ctx.imageSmoothingQuality = 'low';
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        });
        layer.on('postcompose', (event: any) => {
            const ctx = event.context;
            ctx.restore();
        });

        map.getLayers().push(layer);
        return layer;
    }

    updateMapObject(map: ol.Map, layer: ol.layer.Tile, prevProps: Readonly<TileProps>): ol.layer.Tile {
        // TODO: Code duplication in ./Vector.tsx
        if (this.props.source !== prevProps.source) {
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

    removeMapObject(map: ol.Map, layer: ol.layer.Tile): void {
        map.getLayers().remove(layer);
    }
}

const NATURAL_EARTH_2_SOURCE = new ol.source.XYZ(
    {
        url: 'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png',
        attributions: [
            '&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>',
            '&copy; <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors',
        ],
    });

const BATHYMETRY_SOURCE = new ol.source.XYZ(
    {
        url: 'https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}',
        attributions: [
            '&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>',
            '&copy; <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors',
        ]
    });

const OSM_SOURCE = new ol.source.OSM();

const OSM_BW_SOURCE = new ol.source.XYZ(
    {
        url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
        attributions: [
            '&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors',
        ]
    });

