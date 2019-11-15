import * as React from 'react';
import { defaultMemoize } from 'reselect'

import makeStyles from "@material-ui/core/styles/makeStyles";
import Popover from "@material-ui/core/Popover";
import ValueRangeSlider from "./ValueRangeSlider";
import { MouseEvent } from "react";

const useStyles = makeStyles(theme => ({
        title: {
            fontSize: 'x-small',
            fontWeight: 'bold',
            width: '100%',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            paddingBottom: theme.spacing(0.5),
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
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
            paddingBottom: theme.spacing(0.5),
            paddingTop: theme.spacing(0.5),
            color: 'black',
        },
    }
));


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

export default function ColorBarLegend({name, units, imageData, minValue, maxValue, width, height, numTicks}: ColorBarLegendProps) {
    const classes = useStyles();
    const [labelAnchorEl, setLabelAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [selectedValueRange, setSelectedValueRange] = React.useState<[number, number]>([minValue, maxValue]);
    const labelEditorOpen = Boolean(labelAnchorEl);

    const handleCloseLabelEditor = () => {
        setLabelAnchorEl(null);
    };

    const handleOpenLabelEditor = (event: MouseEvent<HTMLDivElement>) => {
        setLabelAnchorEl(event.currentTarget);
        console.log("Label clicked!");
        // if (openValueRangeEditor) {
        //     openValueRangeEditor();
        // }
    };

    const handleOpenColorBarEditor = () => {
        console.log("Color bar clicked!");
    };

    const ticks = computeTicks(minValue, maxValue, numTicks);

    const title = `${name} (${units || '-'})`;

    return (
        <div className={'ol-control ' + classes.container}>
            <div className={classes.title}>
                <span>{title}</span>
            </div>
            <img
                src={`data:image/png;base64,${imageData}`}
                width={width || 240}
                height={height || 24}
                onClick={handleOpenColorBarEditor}
            />
            <div
                className={classes.label}
                onClick={handleOpenLabelEditor}
            >
                {ticks}
            </div>
            <Popover
                anchorEl={labelAnchorEl}
                open={labelEditorOpen}
                onClose={handleCloseLabelEditor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{marginTop: 18}}>
                    <span style={{paddingLeft: 14}}>{title}</span>
                    <ValueRangeSlider
                        originalValueRange={[minValue, maxValue]}
                        selectedValueRange={selectedValueRange}
                        selectValueRange={setSelectedValueRange}
                    />
                </div>
            </Popover>
        </div>
    );
}


function _computeTicks(minValue: number, maxValue: number, numTicks: number = 5): number[] {
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
    return ticks;
}

const computeTicks = defaultMemoize(_computeTicks);