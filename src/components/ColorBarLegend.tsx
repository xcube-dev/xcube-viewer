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


interface ColorBarLegendProps {
    name: string;
    units: string;
    imageData: string;
    minValue: number;
    maxValue: number;
    width?: number | string;
    height?: number | string;
}

export default function ColorBarLegend({name, units, imageData, minValue, maxValue, width, height}: ColorBarLegendProps) {
    const classes = useStyles();

    const handleImageClick = () => {
        console.log("Image clicked!");
    };

    const handleLabelClick = () => {
        console.log("Label clicked!");
    };

    width = width || '240px';
    height = height || '24px';
    const midValue = (minValue + maxValue) / 2;
    return (
        <div className={'ol-control ' + classes.container}>
            <div className={classes.title}>
                <span>{name} ({units || '-'})</span>
            </div>
            <img
                src={`data:image/png;base64,${imageData}`}
                width={width}
                height={height}
                alt={'Legend'}
                onClick={handleImageClick}
            />
            <div className={classes.label} onClick={handleLabelClick}>
                <span>{+minValue.toFixed(2)}</span>
                <span>{+midValue.toFixed(2)}</span>
                <span>{+maxValue.toFixed(2)}</span>
            </div>
        </div>
    );
}
