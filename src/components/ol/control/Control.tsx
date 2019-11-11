import * as React from 'react';
import { OlMap, OlControl } from '../types';

import { MapComponent, MapComponentProps } from "../MapComponent";


interface ControlProps extends MapComponentProps {
    style?: React.CSSProperties;
    className?: string;
}

export class Control extends MapComponent<OlControl, ControlProps> {
    divRef: HTMLDivElement | null;

    handleDivRef = (divRef: HTMLDivElement | null) => {
        this.divRef = divRef;
    };

    addMapObject(map: OlMap): OlControl {
        // console.log(`Control: added control '${this.props.id}'`);
        const control = new OlControl({element: this.divRef!});
        map.addControl(control);
        return control;
    }

    updateMapObject(map: OlMap, control: OlControl, prevProps: Readonly<ControlProps>): OlControl {
        return control;
    }

    removeMapObject(map: OlMap, control: OlControl): void {
        for (let addedControl of map.getControls().getArray()) {
            if (addedControl === control) {
                // console.log(`Control: removing control '${this.props.id}'`);
                map.removeControl(control);
                break;
            }
        }
    }

    render() {
        const {children, style, className} = this.props;
        const _className = (className ? className + ' ' : '') + 'ol-unselectable ol-control';
        return <div style={style} className={_className} ref={this.handleDivRef}>{children}</div>;
    }
}




