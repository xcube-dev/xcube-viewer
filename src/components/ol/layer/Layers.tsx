import * as React from 'react';
import { olx } from "openlayers";


export type LayerElement = React.ReactElement<any> | null | undefined;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LayerOptions<T extends olx.layer.LayerOptions = olx.layer.LayerOptions> = Omit<T, "source">;
export type TileOptions<T extends olx.layer.TileOptions = olx.layer.TileOptions> = Omit<T, "source">;
export type VectorOptions<T extends olx.layer.VectorOptions = olx.layer.VectorOptions> = Omit<T, "source">;

interface LayersProps {
    children: LayerElement[];
}

export function Layers(props: LayersProps) {
    return (<React.Fragment>{props.children}</React.Fragment>);
}

