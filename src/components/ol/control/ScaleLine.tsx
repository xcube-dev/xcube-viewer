import { OlMap, OlScaleLineControl, OlScaleLineControlOptions } from '../types';

import { MapComponent, MapComponentProps } from '../MapComponent';


interface ScaleLineProps extends MapComponentProps, OlScaleLineControlOptions {
    bar?: boolean;
    steps?: number;
    text?: boolean;
}

export class ScaleLine extends MapComponent<OlScaleLineControl, ScaleLineProps> {

    addMapObject(map: OlMap): OlScaleLineControl {
        const control = new OlScaleLineControl(this.getOptions());
        map.addControl(control);
        return control;
    }

    updateMapObject(map: OlMap, control: OlScaleLineControl, prevProps: Readonly<ScaleLineProps>): OlScaleLineControl {
        control.setProperties(this.getOptions());
        return control;
    }

    removeMapObject(map: OlMap, control: OlScaleLineControl): void {
        map.removeControl(control);
    }
}

