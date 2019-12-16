import { default as OlMap } from 'ol/Map';
import { default as OlView } from 'ol/View';
import { ViewOptions as OlViewOptions } from 'ol/View';

import { MapComponent, MapComponentProps } from "./MapComponent";


interface ViewProps extends MapComponentProps, OlViewOptions {
}

export class View extends MapComponent<OlView, ViewProps> {

    addMapObject(map: OlMap): OlView {
        map.getView().setProperties(this.props);
        return map.getView();
    }

    removeMapObject(map: OlMap, object: OlView): void {
    }

    updateMapObject(map: OlMap, object: OlView): OlView {
        map.getView().setProperties(this.props);
        return map.getView();
    }
}

