import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapComponent, MapComponentProps } from '../MapComponent';

export type DrawEvent = ol.interaction.Draw.Event;
export type DrawListener = ((event: DrawEvent) => void) | ((event: DrawEvent) => boolean);

interface DrawProps extends MapComponentProps, olx.interaction.DrawOptions {
    layerId?: string;
    active?: boolean;
    onDrawStart?: DrawListener;
    onDrawEnd?: DrawListener;
}

export class Draw extends MapComponent<ol.interaction.Draw, DrawProps> {

    addMapObject(map: ol.Map): ol.interaction.Draw {
        const draw = new ol.interaction.Draw(this.getOptions());
        let active = !!this.props.active;
        draw.setActive(active);
        map.addInteraction(draw);
        if (active) {
            this.listen(draw, this.props);
        }
        return draw;
    }

    updateMapObject(map: ol.Map, draw: ol.interaction.Draw, prevProps: Readonly<DrawProps>): ol.interaction.Draw {
        draw.setProperties(this.getOptions());
        let active = !!this.props.active;
        draw.setActive(active);
        this.unlisten(draw, prevProps);
        if (active) {
            this.listen(draw, this.props);
        }
        return draw;
    }

    removeMapObject(map: ol.Map, draw: ol.interaction.Draw): void {
        this.unlisten(draw, this.props);
        map.removeInteraction(draw);
    }

    getOptions(): olx.interaction.DrawOptions {
        let options = super.getOptions();
        delete options['layerId'];
        delete options['active'];
        delete options['onDrawStart'];
        delete options['onDrawEnd'];
        const layerId = this.props.layerId;
        if (layerId && !options.source) {
            const vectorLayer = this.getMapObject(layerId);
            if (vectorLayer) {
                options['source'] = (vectorLayer as ol.layer.Vector).getSource();
            }
        }
        return options;
    }

    private listen(draw: ol.interaction.Draw, props: Readonly<DrawProps>) {
        const {onDrawStart, onDrawEnd} = props;
        if (onDrawStart) {
            draw.on('drawstart', onDrawStart);
        }
        if (onDrawEnd) {
            draw.on('drawend', onDrawEnd);
        }
    }

    private unlisten(draw: ol.interaction.Draw, props: Readonly<DrawProps>) {
        const {onDrawStart, onDrawEnd} = props;
        if (onDrawStart) {
            draw.un('drawstart', onDrawStart);
        }
        if (onDrawEnd) {
            draw.un('drawend', onDrawEnd);
        }
    }
}

