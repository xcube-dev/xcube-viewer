import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapContext, MapContextType } from '../Map';


interface VectorProps extends olx.layer.VectorOptions {
    id?: string;
}

export class Vector extends React.Component<VectorProps> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    layer: ol.layer.Vector;

    componentDidMount(): void {
        const map = this.context.map!;
        this.layer = new ol.layer.Vector(this.props);
        map.getLayers().push(this.layer);
        if (this.props.id) {
            this.context.objects![this.props.id] = this.layer;
        }
    }

    componentDidUpdate(prevProps: Readonly<VectorProps>): void {
        // TODO: Code duplication in ./Tile.tsx
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


