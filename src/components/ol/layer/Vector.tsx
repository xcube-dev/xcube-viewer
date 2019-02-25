import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapComponent, MapComponentProps } from "../MapComponent";


interface VectorProps extends MapComponentProps, olx.layer.VectorOptions {
}

export class Vector extends MapComponent<ol.layer.Vector, VectorProps> {
    addMapObject(map: ol.Map): ol.layer.Vector {
        const layer = new ol.layer.Vector(this.props);
        map.getLayers().push(layer);
        return layer;
    }

    updateMapObject(map: ol.Map, layer: ol.layer.Vector, prevProps: Readonly<VectorProps>): ol.layer.Vector {
        // TODO: Code duplication in ./Tile.tsx
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
        return layer;
    }

    removeMapObject(map: ol.Map, layer: ol.layer.Vector): void {
        map.getLayers().remove(layer);
    }
}


