import {OlMap, OlView, OlViewOptions} from './types';
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

