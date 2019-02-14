import * as React from 'react';
import * as ol from 'openlayers';

import 'openlayers/css/ol.css';
import './Map.css';
import { MapContext } from "./Map";


interface ViewProps extends ol.olx.ViewOptions {
}

export class View extends React.Component<ViewProps> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContext;

    context: ol.Map;

    componentDidMount(): void {
        const map = this.context;
        map.getView().setProperties(this.props);
    }

    componentDidUpdate(prevProps: Readonly<ViewProps>): void {
        const map = this.context;
        map.getView().setProperties(this.props);
    }

    render() {
        return null;
    }
}

