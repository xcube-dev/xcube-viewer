import * as React from 'react';
import * as ol from 'openlayers';

import 'openlayers/css/ol.css';
import './Map.css';


export const MapContext = React.createContext<ol.Map | null>(null);

interface MapProps extends ol.olx.MapOptions {
    children?: React.ReactNode;
    onClick?: (event: ol.MapBrowserEvent) => void;
}

interface MapState {
}

const DEFAULT_CONTAINER_SYTLE: React.CSSProperties = {height: '100%'};

const DEFAULT_VIEW = new ol.View(
    {
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
    }
);

export class Map extends React.Component<MapProps, MapState> {

    private map: ol.Map | null;
    private mapDiv: HTMLDivElement | null;

    private getMapOptions(): ol.olx.MapOptions {
        const mapOptions = {...this.props};
        delete mapOptions["children"];
        delete mapOptions["onClick"];
        return mapOptions;
    }

    private handleClick = (event: ol.events.Event) => {
        const onClick = this.props.onClick;
        if (onClick) {
            onClick(event as ol.MapBrowserEvent);
        }
    };

    componentDidMount(): void {
        const mapOptions = this.getMapOptions();
        this.map = new ol.Map({view: DEFAULT_VIEW, ...mapOptions});

        const map = this.map;
        map.setTarget(this.mapDiv!);
        map.on('click', this.handleClick);

        // Force update so we can pass this.map as context to all children in next render()
        this.forceUpdate();
    }

    componentDidUpdate(prevProps: Readonly<MapProps>): void {
        // const mapOptions = this.getMapOptions();
        // this.map!.setProperties(mapOptions)
    }

    componentWillUnmount(): void {
        //this.map = null;
        //this.mapDiv = null;
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

}

