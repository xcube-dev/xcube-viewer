import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapContext } from '../Map';


interface XYZProps extends olx.source.XYZOptions {
    tileOptions?: olx.layer.TileOptions;
}

export class XYZ extends React.Component<XYZProps> {

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
    static contextType = MapContext;

    context: ol.Map;
    layer: ol.layer.Tile;

    componentDidMount(): void {
        const map = this.context;
        const tileOptions = this.props.tileOptions;
        const source = this.createSource();
        this.layer = new ol.layer.Tile({source, ...tileOptions});
        map.getLayers().push(this.layer);
    }

    componentDidUpdate(prevProps: Readonly<XYZProps>): void {
        this.layer.setSource(this.createSource());
    }

    componentWillUnmount(): void {
        const map = this.context;
        map.getLayers().remove(this.layer);
    }

    render() {
        return null;
    }

    private createSource(): ol.source.XYZ {
        const sourceOptions = {...this.props};
        delete sourceOptions['tileOptions'];
        return new ol.source.XYZ(sourceOptions);
    }
}


