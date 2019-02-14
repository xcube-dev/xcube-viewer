import * as React from 'react';


export type LayerElement = React.ReactElement<any> | null | undefined

interface LayersProps {
    children: LayerElement[];
}

export function Layers(props: LayersProps) {
    return (<React.Fragment>{props.children}</React.Fragment>);
}

