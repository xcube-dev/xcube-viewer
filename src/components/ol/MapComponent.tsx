import * as React from 'react';
import { default as OlBaseObject } from 'ol/Object';
import { default as OlMap } from 'ol/Map';

import { MapContext, MapContextType } from './Map';


export interface MapComponentProps {
    id?: string;
}

export abstract class MapComponent<T extends OlBaseObject, P extends MapComponentProps, S = {}> extends React.PureComponent<P, S> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext = {} as MapContext;
    object: T | null = null;

    abstract addMapObject(map: OlMap): T;

    abstract updateMapObject(map: OlMap, object: T, prevProps: Readonly<P>): T;

    abstract removeMapObject(map: OlMap, object: T): void;

    getMapObject(id: string): OlBaseObject | null {
        return (this.context.mapObjects && this.context.mapObjects[id]) || null;
    }

    getOptions(): any {
        let options: any = {...this.props};
        delete options.id;
        return options;
    }

    componentDidMount(): void {
        // console.log("MapComponent.componentDidMount: id =", this.props.id);
        this._updateMapObject(this.addMapObject(this.context.map!));
    }

    componentDidUpdate(prevProps: Readonly<P>): void {
        // console.log("MapComponent.componentDidUpdate: id =", this.props.id);
        this._updateMapObject(this.updateMapObject(this.context.map!, this.object!, prevProps));
    }

    componentWillUnmount(): void {
        // console.log("MapComponent.componentWillUnmount: id =", this.props.id);
        const map = this.context.map!;
        this.removeMapObject(map, this.object!);
        if (this.props.id) {
            delete this.context.mapObjects![this.props.id!];
        }
        this.object = null;
    }

    private _updateMapObject(object: T) {
        if (object != null && this.props.id) {
            object.set("objectId", this.props.id);
            this.context.mapObjects![this.props.id!] = object;
        }
        this.object = object;
    }

    render(): React.ReactNode {
        return null;
    }
}


