import * as React from 'react';

/* Since we there is no up-to-date @types/react-leaflet: */
declare module "react-leaflet" {
    const withLeaflet: <T>(component: T) => T;

    interface LeafletContext {
        map?: L.Map;
    }

    class LeafletConsumer extends React.Component {
    }
}

import { Map, TileLayer, LayersControl, LeafletConsumer, LeafletContext } from 'react-leaflet';
import * as L from "leaflet";
import ErrorBoundary from "./ErrorBoundary";
import Control from "./Control";

import './Viewer.css';

const {BaseLayer} = LayersControl;

interface ViewerProps {
    position?: L.LatLng;
    zoom?: number;
    maxZoom?: number;
}

interface ViewerState {
    center: L.LatLng;
}

class Viewer extends React.Component<ViewerProps, ViewerState> {

    constructor(props: ViewerProps) {
        super(props);
        this.state = {
            center: new L.LatLng(52.0, 10.0)
        }
    }

    handleMapLoad = (e: any) => {
        console.log("handleMapLoad: ", e);
    };

    handleButtonClick = (e: any) => {
        console.log("handleButtonClick: ", e);
        this.setState({center: new L.LatLng(180 * Math.random() - 90, 360 * Math.random() - 180)});
    };


    public render() {
        const {zoom = 5, maxZoom = 24} = this.props;
        return (
            <ErrorBoundary>
                <Map center={this.state.center} zoom={zoom} maxZoom={maxZoom} onload={this.handleMapLoad}>
                    <LayersControl>
                        <BaseLayer checked name={"OpenStreetMap"}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            />
                        </BaseLayer>
                        <BaseLayer name={"Bathymetry"}>
                            <TileLayer
                                url="https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}"
                                attribution="&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>, <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors"
                                maxZoom={9}
                            />
                        </BaseLayer>
                        <BaseLayer name={"Natural Earth II"}>
                            <TileLayer
                                url="https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>, <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors"
                                maxZoom={6}
                            />
                        </BaseLayer>
                    </LayersControl>
                    <Control position="topright">
                        <LeafletConsumer>
                            {(leaflet: LeafletContext) => {
                                console.log("leaflet.map:", leaflet.map);
                                return (
                                    <a className="leaflet-control-layers leaflet-bar" onClick={this.handleButtonClick}>
                                        Reset View
                                    </a>
                                );
                            }}
                        </LeafletConsumer>
                    </Control>
                </Map>
            </ErrorBoundary>
        );
    }
}

export default Viewer;
