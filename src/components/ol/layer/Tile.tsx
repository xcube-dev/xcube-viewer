import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapContext, MapContextType } from '../Map';

interface TileProps extends olx.layer.TileOptions {
}

export class Tile extends React.Component<TileProps> {

    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    layer: ol.layer.Tile;

    componentDidMount(): void {
        const map = this.context.map!;
        this.layer = new ol.layer.Tile(this.props);
        map.getLayers().push(this.layer);
    }

    componentDidUpdate(prevProps: Readonly<TileProps>): void {
        // TODO: Code duplication in ./Vector.tsx
        if (this.props.source !== prevProps.source) {
             this.layer.setSource(this.props.source);
        }
        if (this.props.visible && this.props.visible !== prevProps.visible) {
            this.layer.setVisible(this.props.visible);
        }
        if (this.props.opacity && this.props.opacity !== prevProps.opacity) {
            this.layer.setOpacity(this.props.opacity);
        }
        if (this.props.zIndex && this.props.zIndex !== prevProps.zIndex) {
            this.layer.setZIndex(this.props.zIndex);
        }
        if (this.props.minResolution && this.props.minResolution !== prevProps.minResolution) {
            this.layer.setMinResolution(this.props.minResolution);
        }
        if (this.props.maxResolution && this.props.maxResolution !== prevProps.maxResolution) {
            this.layer.setMaxResolution(this.props.maxResolution);
        }
        // TODO: add more props here
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.getLayers().remove(this.layer);
    }

    render() {
        return null;
    }
}


// noinspection JSUnusedGlobalSymbols
export function NaturalEarth2(): JSX.Element {
    return (
        <Tile
            source={new ol.source.XYZ(
                {
                    url: 'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png',
                    attributions: [
                        '&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>',
                        '&copy; <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors',
                    ],
                })}
        />
    );
}

// noinspection JSUnusedGlobalSymbols
export function Bathymetry(): JSX.Element {
    return (
        <Tile
            source={new ol.source.XYZ(
                {
                    url: 'https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}',
                    attributions: [
                        '&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>',
                        '&copy; <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors',
                    ]
                })}
        />
    );
}

// noinspection JSUnusedGlobalSymbols
export function OSM(): JSX.Element {
    return (
        <Tile source={new ol.source.OSM()}/>
    );
}

// noinspection JSUnusedGlobalSymbols
export function OSMBlackAndWhite(): JSX.Element {
    return (
        <Tile
            source={new ol.source.XYZ(
                {
                    url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                    attributions: [
                        '&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors',
                    ]
                })}
        />
    );
}




