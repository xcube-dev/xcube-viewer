import {
    OlMap,
    OlSelectInteraction,
    OlSelectInteractionOptions,
    OlSelectEvent,
    OlVectorLayer,
    OlFeature,
    OlRenderFeature,
    OlColor,
    OlStyle,
    OlFillStyle,
    OlCircleStyle,
    OlStrokeStyle,
} from '../types';

import { MapComponent, MapComponentProps } from '../MapComponent';

export type SelectEvent = OlSelectEvent;
export type SelectListener = ((event: SelectEvent) => void) | ((event: SelectEvent) => boolean);

interface SelectProps extends MapComponentProps, OlSelectInteractionOptions {
    onSelect?: SelectListener;
    selectedFeaturesIds?: string[];
}


export class Select extends MapComponent<OlSelectInteraction, SelectProps> {

    addMapObject(map: OlMap): OlSelectInteraction {
        const select = new OlSelectInteraction({style: styleFunction, ...this.getOptions()});
        map.addInteraction(select);
        this.updateSelection(select);
        this.listen(select, this.props);
        return select;
    }

    updateMapObject(map: OlMap, select: OlSelectInteraction, prevProps: Readonly<SelectProps>): OlSelectInteraction {
        select.setProperties(this.getOptions());
        this.updateSelection(select);
        this.unlisten(select, prevProps);
        this.listen(select, this.props);
        return select;
    }

    removeMapObject(map: OlMap, select: OlSelectInteraction): void {
        this.unlisten(select, this.props);
        map.removeInteraction(select);
    }

    getOptions(): OlSelectInteractionOptions {
        let options = super.getOptions();
        delete options['onSelect'];
        delete options['selectedFeaturesIds'];
        return options;
    }

    private listen(select: OlSelectInteraction, props: Readonly<SelectProps>) {
        const {onSelect} = props;
        if (onSelect) {
            select.on('select', onSelect);
        }
    }

    private unlisten(select: OlSelectInteraction, props: Readonly<SelectProps>) {
        const {onSelect} = props;
        if (onSelect) {
            select.un('select', onSelect);
        }
    }

    private updateSelection(select: OlSelectInteraction) {
        if (this.context.map && this.props.selectedFeaturesIds) {
            const selectedFeatures = findFeaturesByIds(this.context.map!, this.props.selectedFeaturesIds).filter(f => f !== null) as OlFeature[];
            // console.log("Select: ", this.props.selectedFeaturesIds, selectedFeatures);
            if (selectedFeatures.length > 0) {
                // TODO (forman): must get around OpenLayers weirdness here: Selection style function is called only
                // if a feature does not have any styles set.
                select.getFeatures().clear();
                select.getFeatures().extend(selectedFeatures);
                this.context.map.render();
            }
        }
    }

}


const OL_DEFAULT_FILL = new OlFillStyle({
                                            color: [255, 255, 255, 0.4]
                                        });
const OL_DEFAULT_STROKE_WIDTH = 1.25;
const OL_DEFAULT_STROKE = new OlStrokeStyle({
                                                color: '#3399CC',
                                                width: OL_DEFAULT_STROKE_WIDTH
                                            });
const OL_DEFAULT_CIRCLE_RADIUS = 5;


const SELECT_STROKE_COLOR: OlColor = [255, 255, 0, 0.7];


function styleFunction(feature: (OlFeature | OlRenderFeature), resolution: number) {
    // console.log('style func: properties: ', feature.getProperties());
    // console.log('style func: style: ', (feature as any).getStyle());

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
            && typeof styleObj['getImage'] === 'function') {
            const defaultStyle = styleObj as OlStyle;
            const imageObj = defaultStyle.getImage();
            if (imageObj
                && typeof imageObj['getFill'] === 'function'
                && typeof imageObj['getStroke'] === 'function'
                && typeof imageObj['getRadius'] === 'function') {
                const circle = imageObj as OlCircleStyle;
                defaultFill = circle.getFill();
                defaultStroke = circle.getStroke();
                defaultRadius = circle.getRadius();
            } else {
                defaultFill = defaultStyle.getFill();
                defaultStroke = defaultStyle.getStroke();
            }
        }
    }

    const styleOptions = {
        fill: defaultFill,
        stroke: new OlStrokeStyle({width: 1.5 * (defaultStroke.getWidth() || 1), color: SELECT_STROKE_COLOR})
    };
    const geometry = feature.getGeometry();
    if (geometry && geometry.getType() === 'Point') {
        return new OlStyle({image: new OlCircleStyle({radius: 1.5 * defaultRadius, ...styleOptions})});
    } else {
        return new OlStyle(styleOptions);
    }
}

type FeatureId = string | number;


function findFeaturesByIds(map: OlMap, featureIds: FeatureId[]): (OlFeature | null)[] {
    return featureIds.map(featureId => findFeatureById(map, featureId));
}

function findFeatureById(map: OlMap, featureId: FeatureId): OlFeature | null {
    for (let layer of map.getLayers().getArray()) {
        if (layer instanceof OlVectorLayer) {
            const vectorLayer = layer as OlVectorLayer;
            const feature = vectorLayer.getSource().getFeatureById(featureId);
            if (feature) {
                return feature;
            }
        }
    }
    return null;
}