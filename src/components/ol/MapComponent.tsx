import * as React from 'react';
import * as ol from 'openlayers';

import { MapContext, MapContextType } from './Map';


export interface MapComponentProps {
    id?: string;
}

export abstract class MapComponent<T extends ol.Object, P extends MapComponentProps, S = {}> extends React.Component<P, S> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    object: T | null;

    abstract addMapObject(map: ol.Map): T;

    abstract updateMapObject(map: ol.Map, object: T, prevProps: Readonly<P>): T;

    abstract removeMapObject(map: ol.Map, object: T): void;

    getMapObject(id: string): ol.Object | null {
        return (this.context.mapObjects && this.context.mapObjects[id]) || null;
    }

    getOptions(): any {
        let options: any = {...this.props};
        delete options.id;
        return options;
    }

    componentDidMount(): void {
        this._updateMapObject(this.addMapObject(this.context.map!));
    }

    componentDidUpdate(prevProps: Readonly<P>): void {
        this._updateMapObject(this.updateMapObject(this.context.map!, this.object!, prevProps));
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        this.removeMapObject(map, this.object!);
        if (this.props.id) {
            delete this.context.mapObjects![this.props.id!];
        }
        this.object = null;
    }

    private _updateMapObject(object: T) {
        if (object != null && this.props.id) {
            this.context.mapObjects![this.props.id!] = object;
        }
        this.object = object;
    }

    render(): React.ReactNode {
        return null;
    }
}


