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

import { default as OlMap } from 'ol/Map';
import { default as OlScaleLineControl } from 'ol/control/ScaleLine';
import { Options as OlScaleLineControlOptions} from 'ol/control/ScaleLine';

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

