import * as React from 'react';

import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
        title: {
            fontSize: 'x-small',
            fontWeight: 'bold',
            width: '100%',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            paddingBottom: theme.spacing(1),
        },
        label: {
            fontSize: 'x-small',
            fontWeight: 'bold',
            width: '100%',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
        },
        container: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingBottom: theme.spacing(0.5),
            paddingTop: theme.spacing(0.5),
            color: 'black',
        },
    }
));

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

export default function ColorBarLegend({name, units, imageData, minValue, maxValue, width, height}: ColorBarLegendProps) {
    const classes = useStyles();

    const handleImageClick = () => {
        console.log("Image clicked!");
    };

    const handleLabelClick = () => {
        console.log("Label clicked!");
    };


    const {name, units, imageData, minValue, maxValue} = this.props;
    let {width, height, numTicks} = this.props;
    width = width || '240px';
    height = height || '24px';
    // TODO: move logic out of here
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
        <div className={'ol-control ' + classes.container}>
            <div className={classes.title}>
                <span>{name} ({units || '-'})</span>
            </div>
            <img
                src={`data:image/png;base64,${imageData}`}
                width={width}
                height={height}
                onClick={handleImageClick}
            />
            <div
                className={classes.label}
                style={TICKS_CONTAINER_STYLE}
                onClick={handleLabelClick}
            >
                {ticks}
            </div>
        </div>
    );
}
