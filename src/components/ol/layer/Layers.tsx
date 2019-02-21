import * as React from 'react';
import { MapElement } from '../Map';

interface LayersProps {
    children: MapElement[];
}

export function Layers(props: LayersProps) {
    return (<React.Fragment>{props.children}</React.Fragment>);
}
