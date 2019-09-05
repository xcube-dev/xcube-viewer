import * as ol from 'openlayers';
import { olx } from 'openlayers';

import { MapComponent, MapComponentProps } from '../MapComponent';

export type SelectEvent = ol.interaction.Select.Event;
export type SelectListener = ((event: SelectEvent) => void) | ((event: SelectEvent) => boolean);

interface SelectProps extends MapComponentProps, olx.interaction.SelectOptions {
    onSelect?: SelectListener;
}


export class Select extends MapComponent<ol.interaction.Select, SelectProps> {

    addMapObject(map: ol.Map): ol.interaction.Select {
        const getOptions = new ol.interaction.Select({style: styleFunction, ...this.getOptions()});
        map.addInteraction(getOptions);
        this.listen(getOptions, this.props);
        return getOptions;
    }

    updateMapObject(map: ol.Map, select: ol.interaction.Select, prevProps: Readonly<SelectProps>): ol.interaction.Select {
        select.setProperties(this.getOptions());
        this.unlisten(select, prevProps);
        this.listen(select, this.props);
        return select;
    }

    removeMapObject(map: ol.Map, select: ol.interaction.Select): void {
        this.unlisten(select, this.props);
        map.removeInteraction(select);
    }

    getOptions(): olx.interaction.DrawOptions {
        let options = super.getOptions();
        delete options['onSelect'];
        return options;
    }

    private listen(select: ol.interaction.Select, props: Readonly<SelectProps>) {
        const {onSelect} = props;
        if (onSelect) {
            select.on('select', onSelect);
        }
    }

    private unlisten(select: ol.interaction.Select, props: Readonly<SelectProps>) {
        const {onSelect} = props;
        if (onSelect) {
            select.un('select', onSelect);
        }
    }
}


const OL_DEFAULT_FILL = new ol.style.Fill({
                                              color: [255, 255, 255, 0.4]
                                          });
const OL_DEFAULT_STROKE_WIDTH = 1.25;
const OL_DEFAULT_STROKE = new ol.style.Stroke({
                                                  color: '#3399CC',
                                                  width: OL_DEFAULT_STROKE_WIDTH
                                              });
const OL_DEFAULT_CIRCLE_RADIUS = 5;



const SELECT_STROKE_COLOR: ol.Color = [255, 255, 0, 0.7];



function styleFunction(feature: (ol.Feature | ol.render.Feature), resolution: number) {
    console.log('style func: properties: ', feature.getProperties());
    console.log('style func: style: ', (feature as any).getStyle());

    let defaultFill = OL_DEFAULT_FILL;
    let defaultStroke = OL_DEFAULT_STROKE;
    let defaultRadius = OL_DEFAULT_CIRCLE_RADIUS;

    if (typeof feature['getStyle'] === 'function') {
        let styleObj = feature['getStyle']();
        if (Array.isArray(styleObj)) {
            styleObj = styleObj[0];
        } else if (typeof styleObj === 'function') {
            styleObj = styleObj(feature);
        }
        if (styleObj
            && typeof styleObj['getFill'] === 'function'
            && typeof styleObj['getStroke'] === 'function'
            &&  typeof styleObj['getImage'] === 'function') {
            const defaultStyle = styleObj as ol.style.Style;
            const imageObj = defaultStyle.getImage();
            if (imageObj
                && typeof imageObj['getFill'] === 'function'
                && typeof imageObj['getStroke'] === 'function'
                && typeof imageObj['getRadius'] === 'function') {
                const circle = imageObj as ol.style.Circle;
                defaultFill = circle.getFill();
                defaultStroke = circle.getStroke();
                defaultRadius = circle.getRadius();
            } else {
                defaultFill = defaultStyle.getFill();
                defaultStroke = defaultStyle.getStroke();
            }
        }
    }

    const styleOptions = {fill: defaultFill, stroke: new ol.style.Stroke({width: 1.5 *  defaultStroke.getWidth(), color: SELECT_STROKE_COLOR})};
    if (feature.getGeometry().getType() === 'Point') {
        return new ol.style.Style({image: new ol.style.Circle({radius: 1.5 * defaultRadius, ...styleOptions})});
    } else {
        return new ol.style.Style(styleOptions);
    }
}
