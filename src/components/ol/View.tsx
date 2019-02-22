import * as ol from 'openlayers';

import { MapComponent, MapComponentProps } from "./MapComponent";


interface ViewProps extends MapComponentProps, ol.olx.ViewOptions {
}

export class View extends MapComponent<ol.View, ViewProps> {

    addMapObject(map: ol.Map): ol.View {
        map.getView().setProperties(this.props);
        return map.getView();
    }

    removeMapObject(map: ol.Map, object: ol.View): void {
    }

    updateMapObject(map: ol.Map, object: ol.View): ol.View {
        map.getView().setProperties(this.props);
        return map.getView();
    }
}

