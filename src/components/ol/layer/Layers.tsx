import * as React from 'react';


interface LayersProps {
    children: React.ReactElement<any>[];
}

export function Layers(props: LayersProps) {
    return (<React.Fragment>{props.children}</React.Fragment>);
}

