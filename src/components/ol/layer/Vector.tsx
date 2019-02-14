import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapContext, MapContextType } from '../Map';
import { VectorOptions } from "./Layers";


interface VectorProps extends olx.source.VectorOptions {
    id?: string;
    layerOptions?: VectorOptions;
}

export class Vector extends React.Component<VectorProps> {
    private getOptions(): olx.source.VectorOptions {
        const sourceOptions = {...this.props};
        delete sourceOptions['id'];
        delete sourceOptions['layerOptions'];
        return sourceOptions;
    }

    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    layer: ol.layer.Vector;

    componentDidMount(): void {
        const map = this.context.map!;
        const layerOptions = this.props.layerOptions;
        const source = new ol.source.Vector(this.getOptions());
        this.layer = new ol.layer.Vector({source, ...layerOptions});
        map.getLayers().push(this.layer);
        if (this.props.id) {
            this.context.objects![this.props.id] = this.layer;
        }
    }

    componentDidUpdate(prevProps: Readonly<VectorProps>): void {
        this.layer.getSource().setProperties(this.getOptions());
        if (this.props.id) {
            this.context.objects![this.props.id] = this.layer;
        }
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.getLayers().remove(this.layer);
        if (this.props.id) {
            delete this.context.objects![this.props.id];
        }
    }

    render() {
        return null;
    }

}


