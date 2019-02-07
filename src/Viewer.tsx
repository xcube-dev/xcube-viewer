import * as React from 'react';
import './Viewer.css';
import { Map, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';

const rlc = require('react-leaflet-control');
const Control = rlc.Control;


interface ViewerProps {
    position?: LatLng;
    zoom?: number;
    maxZoom?: number;
}

interface ViewerState {
    center: LatLng;
}

const CENTER = new LatLng(52.0, 10.0);

class Viewer extends React.Component<ViewerProps, ViewerState> {

    constructor(props: ViewerProps) {
        super(props);
        this.state = {
            center: CENTER
        }
    }

    public render() {
        const {zoom = 12, maxZoom = 24} = this.props;
        return (
            <Map center={this.state.center} zoom={zoom} maxZoom={maxZoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <TileLayer
                    url="https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/gebco_2014_contours/MapServer/tile/{z}/{y}/{x}"
                    attribution="&copy; <a href=&quot;https://www.gebco.net/data_and_products/gridded_bathymetry_data/&quot;>GEBCO</a>, <a href=&quot;https://maps.ngdc.noaa.gov/&quot;>NOAHH</a> and contributors"
                    maxZoom={9}
                />
                <TileLayer
                    url="https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;https://www.naturalearthdata.com/&quot;>MapBox</a>, <a href=&quot;https://www.mapbox.com/&quot;>MapBox</a> and contributors"
                    maxZoom={6}
                />
                <Control position="topleft">
                    <button
                        onClick={() => this.setState({center: CENTER})}
                    >
                        Reset View
                    </button>
                </Control>
            </Map>
        );
    }
}

export default Viewer;
