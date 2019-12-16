import { default as OlMap } from 'ol/Map';
import { default as OlVectorLayer } from 'ol/layer/Vector';
import { Options as OlVectorLayerOptions } from 'ol/layer/Vector';

import { MapComponent, MapComponentProps } from "../MapComponent";


interface VectorProps extends MapComponentProps, OlVectorLayerOptions {
}

export class Vector extends MapComponent<OlVectorLayer, VectorProps> {
    addMapObject(map: OlMap): OlVectorLayer {
        const layer = new OlVectorLayer(this.props);
        map.getLayers().push(layer);
        return layer;
    }

    updateMapObject(map: OlMap, layer: OlVectorLayer, prevProps: Readonly<VectorProps>): OlVectorLayer {
        // TODO: Code duplication in ./Tile.tsx
        if (this.props.source !== prevProps.source && this.props.source) {
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

    removeMapObject(map: OlMap, layer: OlVectorLayer): void {
        map.getLayers().remove(layer);
    }
}


