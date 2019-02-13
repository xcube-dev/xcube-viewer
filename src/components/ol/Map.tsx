import * as React from 'react';
import * as ol from 'openlayers';

import 'openlayers/css/ol.css';
import './Map.css';


export const MapContext = React.createContext<ol.Map | null>(null);

interface MapProps extends ol.olx.MapOptions {
    children?: React.ReactNode;
}

interface MapState {
}

const DEFAULT_CONTAINER_SYTLE: React.CSSProperties = {height: '100%'};

export class Map extends React.Component<MapProps, MapState> {

    private map: ol.Map;
    private mapDiv: HTMLDivElement;

    componentDidMount(): void {
        const mapOptions = {...this.props};
        delete mapOptions["children"];
        Map.checkMapOptions(mapOptions);

        const testOptions: ol.olx.MapOptions = {
            // layers: [
            //     new ol.layer.Tile({
            //                           source: new ol.source.OSM()
            //                       })
            // ],
            view: new ol.View({
                                  center: ol.proj.fromLonLat([37.41, 8.82]),
                                  zoom: 4
                              })
        };

        const options: ol.olx.MapOptions = {...testOptions, ...mapOptions};

        this.map = new ol.Map(options);
        this.map.setTarget(this.mapDiv);

        // Force update so we can pass this.map as context to all children in next render()
        this.forceUpdate();
    }

    componentDidUpdate(prevProps: Readonly<MapProps>): void {
        const mapOptions = {...this.props};
        delete mapOptions["children"];
        Map.checkMapOptions(mapOptions);
        // TODO (forman): alter map props here...
    }

    componentWillUnmount(): void {
    }

    render() {
        let childrenWithContext;
        if (this.map) {
            childrenWithContext = (
                <MapContext.Provider value={this.map}>
                    {this.props.children}
                </MapContext.Provider>
            );
        }
        return (
            <div ref={this.handleRef} style={DEFAULT_CONTAINER_SYTLE}>
                {childrenWithContext}
            </div>
        );
    }

    private handleRef = (mapDiv: HTMLDivElement) => {
        this.mapDiv = mapDiv;
        this.mapDiv.onresize = () => {
            if (this.map) {
                this.map.updateSize();
            }
        };
    };

    private static checkMapOptions(options?: ol.olx.MapOptions) {
        if (options) {
            for (let optionName of ['target', 'layers', 'overlays', 'controls', 'interactions']) {
                Map.checkOption('ol.Map', options, optionName);
            }
        }
    }

    private static checkOption(className: string, options: { [name: string]: any }, optionName: string) {
        if (options[optionName]) {
            throw new Error(`${className}: option '${optionName}' is not supported`);
        }
    }
}

