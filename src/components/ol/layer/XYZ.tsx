import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapContext, MapContextType } from '../Map';
import { TileOptions } from "./Layers";


interface XYZProps extends olx.source.XYZOptions {
    layerOptions?: TileOptions;
}

export class XYZ extends React.Component<XYZProps> {

    private getOptions(): olx.source.XYZOptions {
        const options = {...this.props};
        delete options['layerOptions'];
        return options;
    }

    // noinspection JSUnusedGlobalSymbols
    static NaturalEarth(): JSX.Element {
        return <XYZ url={'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png'}
                    attributions={[
                        new ol.Attribution({html: '&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>'}),
                        new ol.Attribution({html: '&copy; <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors'}),
                    ]}/>;
    }

    // noinspection JSUnusedGlobalSymbols
    static Bathymetry(): JSX.Element {
        return <XYZ
            url={'https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}'}
            attributions={[
                new ol.Attribution({html: '&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>'}),
                new ol.Attribution({html: '&copy; <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors'}),
            ]}/>;
    }

    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    layer: ol.layer.Tile;

    componentDidMount(): void {
        const map = this.context.map!;
        const source = new ol.source.XYZ(this.getOptions());
        const layerOptions = this.props.layerOptions;
        this.layer = new ol.layer.Tile({source, ...layerOptions});
        map.getLayers().push(this.layer);
    }

    componentDidUpdate(prevProps: Readonly<XYZProps>): void {
        // Does not work:
        // this.layer.getSource().setProperties(this.getOptions());
        const source = new ol.source.XYZ(this.getOptions());
        this.layer.setSource(source);
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.getLayers().remove(this.layer);
    }

    render() {
        return null;
    }
}


