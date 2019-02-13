import * as React from 'react';

import ErrorBoundary from './ErrorBoundary';
import './Viewer.css';
import { Layers } from './ol/layer/Layers';
import { Map } from './ol/Map';
import { OSM } from './ol/layer/OSM';


interface ViewerProps {
    layers?: React.ReactElement<any>[];
}

class Viewer extends React.Component<ViewerProps> {

    public render() {
        let {layers} = this.props;
        layers = [<OSM/>, ...(layers || [])];
        return (
            <ErrorBoundary>
                <Map>
                    <Layers>
                        {layers}
                    </Layers>
                </Map>
            </ErrorBoundary>
        );
    }
}

export default Viewer;
