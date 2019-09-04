import * as React from 'react';
import * as ol from 'openlayers';

import { MapComponent, MapComponentProps } from "../MapComponent";


interface ControlProps extends MapComponentProps {
    style?: React.CSSProperties;
    className?: string;
}

export class Control extends MapComponent<ol.control.Control , ControlProps> {
    divRef: HTMLDivElement | null;

    handleDivRef = (divRef: HTMLDivElement | null) => {
        this.divRef = divRef;
    };

    addMapObject(map: ol.Map): ol.control.Control {
        const control = new ol.control.Control({element: this.divRef!, target: this.context.mapDiv!});
        map.addControl(control);
        return control;
    }

    updateMapObject(map: ol.Map, control: ol.control.Control, prevProps: Readonly<ControlProps>): ol.control.Control {
        return control;
    }

    removeMapObject(map: ol.Map, control: ol.control.Control): void {
        map.removeControl(control);
    }

    render() {
        const {children, style, className} = this.props;
        return <div style={style} className={className} ref={this.handleDivRef}>{children}</div>;
    }
}




