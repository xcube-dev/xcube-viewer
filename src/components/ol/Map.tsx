import * as React from 'react';
import * as ol from 'openlayers';

import 'openlayers/css/ol.css';
import './Map.css';


export type MapElement = React.ReactElement<any> | null | undefined;

export interface MapContext {
    map?: ol.Map;
    mapDiv?: HTMLDivElement | null;
    mapObjects: { [id: string]: ol.Object };
}

export const MapContextType = React.createContext<MapContext>({mapObjects: {}});

interface MapProps extends ol.olx.MapOptions {
    id: string;
    children?: React.ReactNode;
    mapObjects?: { [id: string]: ol.Object };
    onClick?: (event: ol.MapBrowserEvent) => void;
    onMapRef?: (map: ol.Map | null) => void;
    isStale?: boolean;
}

interface MapState {
}

const DEFAULT_CONTAINER_SYTLE: React.CSSProperties = {height: '100%'};

export class Map extends React.Component<MapProps, MapState> {

    private readonly contextValue: MapContext;

    constructor(props: MapProps) {
        super(props);
        // console.log("Map.constructor: id =", this.props.id);

        const {id, mapObjects} = props;
        if (mapObjects) {
            this.contextValue = {
                map: mapObjects[id] as ol.Map || undefined,
                mapObjects: mapObjects
            };
        } else {
            this.contextValue = {
                mapObjects: {}
            };
        }
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

    private handleRef = (mapDiv: HTMLDivElement | null) => {
        this.contextValue.mapDiv = mapDiv;
    };

    private handleResize = () => {
        const mapDiv = this.contextValue.mapDiv;
        const map = this.contextValue.map;
        if (mapDiv && map) {
            map.updateSize();
            const view = map.getView();
            const minZoom = this.getMinZoom(mapDiv);
            if (minZoom !== view.getMinZoom()) {
                view.setMinZoom(minZoom);
            }
        }
    };

    private getMinZoom = (target: HTMLDivElement) => {
        // Adjust the view's minZoom so there is only one world,
        // see https://openlayers.org/en/latest/examples/min-zoom.html
        const size = target.clientWidth;
        const minZoom = Math.LOG2E * Math.log(size / 256);
        if (minZoom >= 0.0) {
            return minZoom;
        }
        return 0;
    };

    componentDidMount(): void {
        // console.log('Map.componentDidMount: id =', this.props.id);

        const {id} = this.props;
        const mapDiv = this.contextValue.mapDiv!;

        let map: ol.Map | undefined;
        if (this.props.isStale) {
            const mapObject = this.contextValue.mapObjects[id];
            if (mapObject && mapObject['addControl'] && mapObject['addLayer'] && mapObject['setTarget']) {
                map = mapObject as ol.Map;
                map.setTarget(mapDiv);
            }
        }

        if (!map) {
            const initialZoom = this.getMinZoom(mapDiv);
            const view = new ol.View({
                                         center: ol.proj.fromLonLat([0, 0]),
                                         minZoom: initialZoom,
                                         zoom: initialZoom,
                                     });
            map = new ol.Map({
                                 view,
                                 ...this.getMapOptions(),
                                 target: mapDiv
                             });
        }

        this.contextValue.map = map;
        this.contextValue.mapObjects[id] = map;

        map.set('objectId', this.props.id);
        map.on('click', this.handleClick);
        map.updateSize();

        // Force update so we can pass this.map as context to all children in next render()
        this.forceUpdate();

        // Add resize listener so we can adjust the view's minZoom.
        // See https://openlayers.org/en/latest/examples/min-zoom.html
        window.addEventListener('resize', this.handleResize);
        mapDiv.onresize = () => {
            if (this.contextValue.map) {
                this.contextValue.map.updateSize();
            }
        };

        const onMapRef = this.props.onMapRef;
        if (onMapRef) {
            onMapRef(map);
        }
    }

    componentDidUpdate(prevProps: Readonly<MapProps>): void {
        // console.log('Map.componentDidUpdate: id =', this.props.id);

        const map = this.contextValue.map!;
        const mapDiv = this.contextValue.mapDiv!;
        const mapOptions = this.getMapOptions();
        map.setProperties({...mapOptions});
        map.setTarget(mapDiv);
        map.updateSize();
    }

    componentWillUnmount(): void {
        // console.log('Map.componentWillUnmount: id =', this.props.id);

        const mapDiv = this.contextValue.mapDiv!;
        mapDiv.onresize = null;

        // Remove resize listener so we can adjust the view's minZoom.
        window.removeEventListener('resize', this.handleResize);

        const onMapRef = this.props.onMapRef;
        if (onMapRef) {
            onMapRef(null);
        }
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
}

