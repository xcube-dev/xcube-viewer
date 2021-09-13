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
import { default as OlTileLayer } from 'ol/layer/Tile';
import { default as OlTileSource } from 'ol/source/Tile';
import { default as OlTileGrid } from 'ol/tilegrid/TileGrid';
import { default as OlUrlTileSource } from 'ol/source/UrlTile';
import { default as OlXYZSource } from 'ol/source/XYZ';
import { default as OlOSMSource } from 'ol/source/OSM';
import { Options as OlTileLayerOptions } from 'ol/layer/BaseTile';

import { MapComponent, MapComponentProps } from '../MapComponent';


// noinspection JSUnusedGlobalSymbols
export function NaturalEarth2(): JSX.Element {
    return <Tile id={'NaturalEarth2'} source={NATURAL_EARTH_2_SOURCE}/>;
}

// noinspection JSUnusedGlobalSymbols
export function Bathymetry(): JSX.Element {
    return <Tile id={'Bathymetry'} source={BATHYMETRY_SOURCE}/>;
}

// noinspection JSUnusedGlobalSymbols
export function OSM(): JSX.Element {
    return <Tile id={'OSM'} source={OSM_SOURCE}/>;
}

// noinspection JSUnusedGlobalSymbols
export function OSMBlackAndWhite(): JSX.Element {
    return <Tile id={'OSMBW'} source={OSM_BW_SOURCE}/>;
}


interface TileProps extends MapComponentProps, OlTileLayerOptions {
}


export class Tile extends MapComponent<OlTileLayer, TileProps> {

    addMapObject(map: OlMap): OlTileLayer {
        const layer = new OlTileLayer(this.props);
        map.getLayers().push(layer);
        return layer;
    }

    updateMapObject(map: OlMap, layer: OlTileLayer, prevProps: Readonly<TileProps>): OlTileLayer {
        const oldSource: OlTileSource = layer.getSource();
        const newSource: OlTileSource | undefined = this.props.source;
        if (newSource && oldSource !== newSource) {
            // We don't expect anything to change in a XYZ source
            // but the tile URL and the new imageSmoothing property.
            // Just setting source properties allows for
            // smooth layer transitions.
            // Replacing the entire source cause the layer
            // to flicker in the map.
            // See https://github.com/dcs4cop/xcube-viewer/issues/119
            //
            // If the tile source's URL changes, we just set the URL.
            // Otherwise we replace the source.
            // Since we cannot detect which single source properties
            // have changed, we assume here that the URL, if changed, is the
            // only changed property. This is not a valid assumption
            // in the general case.
            //
            let replaceSource = true;
            if (oldSource instanceof OlUrlTileSource && newSource instanceof OlUrlTileSource) {
                const oldUrlTileSource: OlUrlTileSource = oldSource;
                const newUrlTileSource: OlUrlTileSource = newSource;

                const oldTileGrid = oldUrlTileSource.getTileGrid();
                const newTileGrid = oldUrlTileSource.getTileGrid();
                if (equalTileGrids(oldTileGrid, newTileGrid)) {
                    const oldUrls = oldUrlTileSource.getUrls();
                    const newUrls = newUrlTileSource.getUrls();
                    if (oldUrls !== newUrls && newUrls && (oldUrls === null || oldUrls[0] !== newUrls[0])) {
                        oldUrlTileSource.setUrls(newUrls!);
                        replaceSource = false;
                    }
                    const oldTileLoadFunction = oldUrlTileSource.getTileLoadFunction();
                    const newTileLoadFunction = newUrlTileSource.getTileLoadFunction();
                    if (oldTileLoadFunction !== newTileLoadFunction) {
                        oldUrlTileSource.setTileLoadFunction(newTileLoadFunction!);
                        replaceSource = false;
                    }
                    const oldTileUrlFunction = oldUrlTileSource.getTileUrlFunction();
                    const newTileUrlFunction = newUrlTileSource.getTileUrlFunction();
                    if (oldTileUrlFunction !== newTileUrlFunction) {
                        oldUrlTileSource.setTileUrlFunction(newTileUrlFunction!);
                        replaceSource = false;
                    }
                } else {
                    console.debug('tile grids are not equal!');
                }
            }
            const oldContextOptions = oldSource.getContextOptions()
            const newContextOptions = newSource.getContextOptions()
            const oldImageSmoothing = typeof oldContextOptions === 'object' ?
                                      (oldContextOptions as { [key: string]: any }).imageSmoothing : true;
            const newImageSmoothing = typeof newContextOptions === 'object' ?
                                      (newContextOptions as { [key: string]: any }).imageSmoothing : true;
            if (oldImageSmoothing !== newImageSmoothing) {
                replaceSource = true;
            }

            if (replaceSource) {
                // Replace the entire source and accept layer flickering.
                layer.setSource(newSource);
            }
        }
        // TODO: Code duplication in ./Vector.tsx
        if (this.props.visible && this.props.visible !== prevProps.visible) {
            layer.setVisible(this.props.visible);
        }
        if (this.props.opacity && this.props.opacity !== prevProps.opacity) {
            layer.setOpacity(this.props.opacity);
        }
        if (this.props.zIndex && this.props.zIndex !== prevProps.zIndex) {
            layer.setZIndex(this.props.zIndex);
        }
        if (this.props.minResolution && this.props.minResolution !== prevProps.minResolution) {
            layer.setMinResolution(this.props.minResolution);
        }
        if (this.props.maxResolution && this.props.maxResolution !== prevProps.maxResolution) {
            layer.setMaxResolution(this.props.maxResolution);
        }
        // TODO: add more props here
        return layer;
    }

    removeMapObject(map: OlMap, layer: OlTileLayer): void {
        map.getLayers().remove(layer);
    }
}

const NATURAL_EARTH_2_SOURCE = new OlXYZSource(
    {
        url: 'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png',
        attributions: [
            '&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>',
            '&copy; <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors',
        ],
    });

const BATHYMETRY_SOURCE = new OlXYZSource(
    {
        url: 'https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}',
        attributions: [
            '&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>',
            '&copy; <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors',
        ]
    });

const OSM_SOURCE = new OlOSMSource();

const OSM_BW_SOURCE = new OlXYZSource(
    {
        url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
        attributions: [
            '&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors',
        ]
    });


function equalTileGrids(oldTileGrid: OlTileGrid, newTileGrid: OlTileGrid) {
    // Check min/max zoom level
    if (oldTileGrid.getMinZoom() !== newTileGrid.getMinZoom()
        || oldTileGrid.getMaxZoom() !== newTileGrid.getMaxZoom()) {
        return false;
    }

    // Check extents
    const oldExtent = oldTileGrid.getExtent();
    const newExtent = newTileGrid.getExtent();
    for (let i = 0; i < oldExtent.length; i++) {
        if (oldExtent[i] !== newExtent[i]) {
            return false;
        }
    }

    // Check number of z-levels
    const oldResolutions = oldTileGrid.getResolutions();
    const newResolutions = newTileGrid.getResolutions();
    const numLevels = oldResolutions.length;
    if (numLevels !== newResolutions.length) {
        return false;
    }

    // Check all z-level properties are equal
    for (let z = 0; z < numLevels; z++) {
        // Check resolution
        const oldResolution = oldTileGrid.getResolution(z);
        const newResolution = newTileGrid.getResolution(z);
        if (oldResolution !== newResolution) {
            return false;
        }
        // Check origin
        const oldOrigin = oldTileGrid.getOrigin(z);
        const newOrigin = newTileGrid.getOrigin(z);
        for (let i = 0; i < oldOrigin.length; i++) {
            if (oldOrigin[i] !== newOrigin[i]) {
                return false;
            }
        }
        // Check tile size
        let oldTileSize = oldTileGrid.getTileSize(z);
        let newTileSize = newTileGrid.getTileSize(z);
        for (let i = 0; i < oldOrigin.length; i++) {
            if (typeof oldTileSize === 'number') {
                oldTileSize = [oldTileSize, oldTileSize]
            }
            if (typeof newTileSize === 'number') {
                newTileSize = [newTileSize, newTileSize]
            }
            if (oldTileSize[0] != newTileSize[0]
                || oldTileSize[1] != newTileSize[1]) {
                return false;
            }
        }
        // Check tile range
        let oldTileRange = oldTileGrid.getFullTileRange(z);
        let newTileRange = newTileGrid.getFullTileRange(z);
        if (oldTileRange.getWidth() !== newTileRange.getWidth()
            || oldTileRange.getHeight() !== newTileRange.getHeight()) {
            return false;
        }
    }
    return true;
}
