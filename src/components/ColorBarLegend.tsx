import * as React from 'react';


const LABEL_CONTAINER_STYLE = {
    fontSize: 'x-small',
    fontWeight: 'bold',
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    paddingBottom: '0.5em',
} as React.CSSProperties;

const LEGEND_CONTAINER_STYLE: React.CSSProperties = {padding: '0.5em', color: 'black'};

interface ColorBarLegendProps {
    name: string;
    units: string;
    imageData: string;
    minValue: number;
    maxValue: number;
    width?: number | string;
    height?: number | string;
}

export default class ColorBarLegend extends React.Component<ColorBarLegendProps> {

    render() {
        const {name, units, imageData, minValue, maxValue} = this.props;
        let {width, height} = this.props;
        width = width || '240px';
        height = height || '24px';
        return (
            <div className={'ol-control'} style={LEGEND_CONTAINER_STYLE}>
                <div style={LABEL_CONTAINER_STYLE}>
                    <span>{+minValue.toFixed(2)}</span>
                    <span>{name} ({units || '-'})</span>
                    <span>{+maxValue.toFixed(2)}</span>
                </div>
                <img src={`data:image/png;base64,${imageData}`} width={width} height={height}/>
            </div>
        );
    }
}
