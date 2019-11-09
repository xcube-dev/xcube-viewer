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
        const control = new OlControl({element: this.divRef!, target: this.context.mapDiv!});
        map.addControl(control);
        return control;
    }

    updateMapObject(map: OlMap, control: OlControl, prevProps: Readonly<ControlProps>): OlControl {
        return control;
    }

    removeMapObject(map: OlMap, control: OlControl): void {
        for (let addedControl of map.getControls().getArray()) {
            if (addedControl === control) {
                console.warn(`NOT removing control '${this.props.id}'`);
                // TODO (forman): when we uncomment following line, we later receive error:
                //                NotFoundError: Failed to execute 'removeChild' on 'Node':
                //                The node to be removed is not a child of this node.
                // map.removeControl(control);
                break;
            }
        }
    }

    render() {
        const {children, style, className} = this.props;
        return <div style={style} className={className} ref={this.handleDivRef}>{children}</div>;
    }
}




