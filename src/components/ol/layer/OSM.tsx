import * as React from 'react';
import * as ol from "openlayers";

import { MapContext } from "../Map";


interface OSMProps {
}

export class OSM extends React.Component<OSMProps> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContext;

    context: ol.Map;
    layer: ol.layer.Tile;

    componentDidMount(): void {
        const map = this.context;
        this.layer = new ol.layer.Tile({source: new ol.source.OSM()});
        map.getLayers().push(this.layer);
    }

    componentWillUnmount(): void {
        const map = this.context;
        map.getLayers().remove(this.layer);
    }

    render() {
        return null;
    }
}
