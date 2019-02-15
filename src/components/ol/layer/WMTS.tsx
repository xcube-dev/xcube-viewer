import * as React from 'react';
import * as ol from "openlayers";

import { MapContext, MapContextType } from "../Map";
import { TileOptions } from "./Layers";


interface WMTSProps extends ol.olx.source.WMTSOptions {
    layerOptions: TileOptions;
    capabilities: ol.GlobalObject;
}

export class WMTS extends React.Component<WMTSProps> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    layer: ol.layer.Tile;

    componentDidMount(): void {
        const map = this.context.map!;
        this.layer = this.createLayer();
        map.getLayers().push(this.layer);
    }

    componentDidUpdate(prevProps: Readonly<WMTSProps>): void {
        const map = this.context.map!;
        const layerIndex = map.getLayers().getArray().findIndex(layer => layer === this.layer);
        this.layer = this.createLayer();
        map.getLayers().setAt(layerIndex, this.layer);
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.getLayers().remove(this.layer);
    }

    render() {
        return null;
    }

    private createLayer(): ol.layer.Tile {
        const {layerOptions, capabilities} = this.props;
        let sourceOptions: ol.olx.source.WMTSOptions = {...this.props};
        delete sourceOptions["layerOptions"];
        delete sourceOptions["capabilities"];
        sourceOptions = ol.source.WMTS.optionsFromCapabilities(capabilities, sourceOptions);
        const source = new ol.source.WMTS(sourceOptions);
        return new ol.layer.Tile({source, ...layerOptions});
    }
}
