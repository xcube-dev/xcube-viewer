import * as ReactDOM from 'react-dom';
import * as L from "leaflet";
import { MapControl, withLeaflet } from 'react-leaflet';

/**
 * DivControl is a custom Leaflet control that creates an empty "div" element.
 */
const DivControl = L.Control.extend(
    {
        onAdd: function (map: L.Map) {
            const container = L.DomUtil.create('div');
            L.DomEvent.disableClickPropagation(container);
            return container;
        },

        onRemove: function (map: L.Map) {
            // Nothing to do here
        }
    }
);

type ControlProps = L.ControlOptions;

/**
 * _Control is a custom Leaflet-React map control that renders its children into the DivControl.
 */
class _Control extends MapControl {

    createLeafletElement(props: ControlProps): any {
        return new (DivControl as { new(...args: any[]): any })(props);
    }

    updateLeafletElement(fromProps: ControlProps, toProps: ControlProps): void {
        super.updateLeafletElement(fromProps, toProps);
    }

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }
        // TODO: check this: Without this.forceUpdate(), this.render() is called only once
        // while this.leafletElement.getContainer() still being undefined.
        this.forceUpdate(() => {
            // console.log("Updated forced", this.leafletElement.getContainer());
        });
    }

    render() {
        const leafletElement = this.leafletElement;
        if (!leafletElement) {
            return null;
        }
        const container = leafletElement.getContainer();
        if (!container) {
            return null;
        }
        return ReactDOM.createPortal(this.props.children, container);
    }
}

export default withLeaflet(_Control);