import * as React from 'react';


const LABEL_CONTAINER_STYLE = {
    fontSize: 'x-small',
    fontWeight: 'bold',
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
} as React.CSSProperties;

const TITLE_CONTAINER_STYLE = {
    ...LABEL_CONTAINER_STYLE,
    justifyContent: 'center',
    paddingBottom: '0.5em',
} as React.CSSProperties;

const TICKS_CONTAINER_STYLE = {
    ...LABEL_CONTAINER_STYLE,
    justifyContent: 'space-between',
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
    numTicks?: number;
}

export default class ColorBarLegend extends React.Component<ColorBarLegendProps> {

    render() {
        const {name, units, imageData, minValue, maxValue} = this.props;
        let {width, height, numTicks} = this.props;
        width = width || '240px';
        height = height || '24px';
        numTicks = numTicks || 5;
        const fractionDigits = Math.min(10, Math.max(2, Math.round(-Math.log10(maxValue - minValue))));
        const delta = (maxValue - minValue) / (numTicks - 1);
        const ticks = new Array(numTicks);
        for (let i = 0; i < numTicks; i++) {
            let v = minValue + i * delta;
            let vr = Math.round(v);
            if (Math.abs(vr - v) < 1e-8) {
                ticks[i] = (<span key={i}>{vr}</span>);
            } else {
                ticks[i] = (<span key={i}>{v.toFixed(fractionDigits)}</span>);
            }
        }
        return (
            <div className={'ol-control'} style={LEGEND_CONTAINER_STYLE}>
                <div style={TITLE_CONTAINER_STYLE}>
                    <span>{name} ({units || '-'})</span>
                </div>
                <img src={`data:image/png;base64,${imageData}`} width={width} height={height}/>
                <div style={TICKS_CONTAINER_STYLE}>
                    {ticks}
                </div>
            </div>
        );
    }
}
