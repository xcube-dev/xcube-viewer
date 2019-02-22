import * as ol from 'openlayers';
import { olx } from "openlayers";

import { MapComponent, MapComponentProps } from "../MapComponent";


interface DrawProps extends MapComponentProps, olx.interaction.DrawOptions {
    layerId?: string;
}

export class Draw extends MapComponent<ol.interaction.Draw, DrawProps> {

    addMapObject(map: ol.Map): ol.interaction.Draw {
        const draw = new ol.interaction.Draw(this.getOptions());
        map.addInteraction(draw);
        return draw;
    }

    updateMapObject(map: ol.Map, draw: ol.interaction.Draw, prevProps: Readonly<DrawProps>): ol.interaction.Draw {
        draw.setProperties(this.getOptions());
        return draw;
    }

    removeMapObject(map: ol.Map, draw: ol.interaction.Draw): void {
        map.removeInteraction(draw);
    }

    getOptions(): olx.interaction.DrawOptions {
        let options = super.getOptions();
        delete options["layerId"];
        const layerId = this.props.layerId;
        if (layerId && !options.source) {
            const vectorLayer = this.getMapObject(layerId);
            if (vectorLayer) {
                options["source"] = (vectorLayer as ol.layer.Vector).getSource();
            }
        }
        return options;
    }
}

