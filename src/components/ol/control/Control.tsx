/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from 'react';
import { default as OlMap } from 'ol/Map';
import { Control as OlControl } from 'ol/control';

import { MapComponent, MapComponentProps } from "../MapComponent";


interface ControlProps extends MapComponentProps {
    style?: React.CSSProperties;
    className?: string;
}

export class Control extends MapComponent<OlControl, ControlProps> {
    divRef: HTMLDivElement | null = null;

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




