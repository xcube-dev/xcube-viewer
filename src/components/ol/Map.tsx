import * as React from 'react';
import * as ol from 'openlayers';

import 'openlayers/css/ol.css';
import './Map.css';


export type MapElement = React.ReactElement<any> | null | undefined;

export interface MapContext {
    map?: ol.Map;
    mapDiv?: HTMLDivElement | null;
    mapObjects?: { [id: string]: ol.Object };
}

export const MapContextType = React.createContext<MapContext>({});

interface MapProps extends ol.olx.MapOptions {
    children?: React.ReactNode;
    onClick?: (event: ol.MapBrowserEvent) => void;
    onMapRef?: (map: ol.Map | null) => void;
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

    private contextValue: MapContext;

    constructor(props: MapProps) {
        super(props);
        this.contextValue = {mapObjects: {}};
    }

    private getMapOptions(): ol.olx.MapOptions {
        const mapOptions = {...this.props};
        delete mapOptions['children'];
        delete mapOptions['onClick'];
        return mapOptions;
    }

    private handleClick = (event: ol.events.Event) => {
        const onClick = this.props.onClick;
        if (onClick) {
            onClick(event as ol.MapBrowserEvent);
        }
    };

    componentDidMount(): void {
        // console.log("Map.componentDidMount: new Map!");
        const mapOptions = this.getMapOptions();
        const target = this.contextValue.mapDiv!;
        const map = new ol.Map({view: DEFAULT_VIEW, ...mapOptions, target});
        this.contextValue.map = map;

        map.on('click', this.handleClick);

        // Force update so we can pass this.map as context to all children in next render()
        this.forceUpdate();

        const onMapRef = this.props.onMapRef;
        if (onMapRef) {
            onMapRef(map);
        }
    }

    componentDidUpdate(prevProps: Readonly<MapProps>): void {
        // console.log("Map.componentDidUpdate: update Map!");
        const map = this.contextValue.map;
        const mapOptions = this.getMapOptions();
        map!.setProperties({...mapOptions, target: this.contextValue.mapDiv});
    }

    componentWillUnmount(): void {
        // console.log("Map.componentWillUnmount: remove Map!");
        const onMapRef = this.props.onMapRef;
        if (onMapRef) {
            onMapRef(null);
        }
        this.contextValue = {};
    }

    render() {
        let childrenWithContext;
        if (this.contextValue.map) {
            childrenWithContext = (
                <MapContextType.Provider value={this.contextValue}>
                    {this.props.children}
                </MapContextType.Provider>
            );
        }
        return (
            <div ref={this.handleRef} style={DEFAULT_CONTAINER_SYTLE}>
                {childrenWithContext}
            </div>
        );
    }

    private handleRef = (mapDiv: HTMLDivElement | null) => {
        if (mapDiv !== null) {
            mapDiv.onresize = () => {
                const map = this.contextValue.map;
                if (map) {
                    map.updateSize();
                }
            };
        }
        this.contextValue.mapDiv = mapDiv;
    };
}

