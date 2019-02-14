import * as React from 'react';
import * as ol from 'openlayers';
import { olx } from "openlayers";

import 'openlayers/css/ol.css';
import '../Map.css';
import { MapContext, MapContextType } from "../Map";


interface DrawProps extends olx.interaction.DrawOptions {
    id? : string;
    layerId?: string;
}

export class Draw extends React.Component<DrawProps> {

    private getOptions(): olx.interaction.DrawOptions {

        const options = {...this.props};
        delete options["id"];
        delete options["layerId"];

        const layerId = this.props.layerId;
        if (layerId && !options.source) {
            const vectorLayer = this.context.objects![layerId];
            if (vectorLayer) {
                options["source"] = (vectorLayer as ol.layer.Vector).getSource();
            }
        }

        console.log("Draw.getOptions: ", options);

        return options;
    }

    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    draw: ol.interaction.Draw | null;

    componentDidMount(): void {
        const map = this.context.map!;
        this.draw = new ol.interaction.Draw(this.getOptions());
        map.addInteraction(this.draw);
        if (this.props.id) {
            this.context.objects![this.props.id] = this.draw;
        }
    }

    componentDidUpdate(prevProps: Readonly<DrawProps>): void {
        this.draw!.setProperties(this.getOptions());
        if (this.props.id) {
            this.context.objects![this.props.id] = this.draw!;
        }
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.removeInteraction(this.draw!);
        this.draw = null;
        if (this.props.id) {
            delete this.context.objects![this.props.id];
        }
    }

    render() {
        return null;
    }
}

