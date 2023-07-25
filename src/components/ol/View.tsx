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

import {default as OlMap} from 'ol/Map';
import {default as OlView, ViewOptions as OlViewOptions} from 'ol/View';
import { default as OlVectorLayer } from 'ol/layer/Vector';
import { default as OlFeature } from 'ol/Feature';
import {ProjectionLike as OlProjectionLike, transform as olTransform} from 'ol/proj';

import {MapComponent, MapComponentProps} from "./MapComponent";

interface ViewProps extends MapComponentProps, OlViewOptions {
}

export class View extends MapComponent<OlView, ViewProps> {

    addMapObject(map: OlMap): OlView {
        return this.updateView(map);
    }

    removeMapObject(map: OlMap, object: OlView): void {
    }

    updateMapObject(map: OlMap, object: OlView): OlView {
        return this.updateView(map);
    }

    updateView(map: OlMap): OlView {
        const newProjection = this.props.projection;
        let oldProjection: OlProjectionLike = map.getView().getProjection();
        if (typeof newProjection === 'string') {
            if (oldProjection) {
                oldProjection = oldProjection.getCode();
            }
        }
        if (newProjection && newProjection !== oldProjection) {
            const oldView = map.getView();
            const newView = new OlView({
                ...this.props,
                center: olTransform(oldView.getCenter() || [0, 0],
                    oldProjection,
                    newProjection
                ),
                minZoom: oldView.getMinZoom(),
                zoom: oldView.getZoom(),
            });
            map.getLayers().forEach(layer => {
                if (layer instanceof OlVectorLayer) {
                    layer.getSource().forEachFeature((feature: OlFeature) => {
                        feature.getGeometry()?.transform(oldProjection, newProjection);
                    });
                }
            })
            map.setView(newView);
        } else {
            map.getView().setProperties(this.props);
        }
        return map.getView();
    }
}

