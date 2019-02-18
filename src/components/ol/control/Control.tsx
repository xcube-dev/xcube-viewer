import * as React from 'react';
import * as ol from 'openlayers';
import { MapContextType, MapContext } from '../Map';


interface ControlProps {
    style?: React.CSSProperties;
    className?: string;
}

export class Control extends React.Component<ControlProps> {
    // noinspection JSUnusedGlobalSymbols
    static contextType = MapContextType;
    context: MapContext;
    control: ol.control.Control | null;
    divRef: HTMLDivElement | null;

    handleDivRef = (divRef: HTMLDivElement | null) => {
        this.divRef = divRef;
    };

    componentDidMount(): void {
        const map = this.context.map!;
        this.control = new ol.control.Control({element: this.divRef!, target: map.getTarget()});
        // this.control.setTarget(map.getTargetElement());
        map.addControl(this.control);
    }

    componentWillUnmount(): void {
        const map = this.context.map!;
        map.removeControl(this.control!);
        this.control = null;
    }

    render() {
        const {children, style, className} = this.props;
        return <div style={style} className={className} ref={this.handleDivRef}>{children}</div>;
    }
}




