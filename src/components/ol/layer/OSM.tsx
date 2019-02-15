import * as React from 'react';
import * as ol from "openlayers";
import { olx } from "openlayers";

import { MapContext, MapContextType } from "../Map";
import { TileOptions } from "./Layers";


interface OSMProps extends olx.source.OSMOptions {
    layerOptions?: TileOptions;
}

export class OSM extends React.Component<OSMProps> {

    private getOptions(): olx.source.XYZOptions {
        const options = {...this.props};
        delete options['layerOptions'];
        return options;
    }

    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    layer: ol.layer.Tile;

    componentDidMount(): void {
        const map = this.context.map!;
        const source = new ol.source.OSM(this.getOptions());
        const layerOptions = this.props.layerOptions;
        this.layer = new ol.layer.Tile({source, ...layerOptions});
        map.getLayers().push(this.layer);
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.getLayers().remove(this.layer);
    }

    render() {
        return null;
    }
}
