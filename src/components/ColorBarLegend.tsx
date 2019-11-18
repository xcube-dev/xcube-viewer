import * as React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Popover from "@material-ui/core/Popover";
import Slider, { Mark } from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";

// import { arange } from '../util/label'
import { getLabelsFromArray, getLabelsFromRange } from '../util/label'
import { ColorBars } from "../model/colorBar";

const HOR_MARGIN = 5;

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
        sliderBox: {
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(HOR_MARGIN),
            marginRight: theme.spacing(HOR_MARGIN),
            minWidth: 300,
            width: `calc(100% - ${theme.spacing(2 * (HOR_MARGIN + 1))}px)`,
        },

    }
));


interface ColorBarLegendProps {
    variableName: string;
    variableUnits: string;
    variableColorBarMinMax: [number, number];
    variableColorBarName: string;
    updateVariableColorBar: (colorBarMinMax: [number, number], colorBarName: string) => void;
    colorBars: ColorBars;
    width?: number | string;
    height?: number | string;
    numTicks?: number;
}

export default function ColorBarLegend({
                                           variableName,
                                           variableUnits,
                                           variableColorBarMinMax,
                                           variableColorBarName,
                                           updateVariableColorBar,
                                           colorBars,
                                           width, height,
                                           numTicks}: ColorBarLegendProps) {
    const classes = useStyles();
    const [colorBarMinMaxAnchorEl, setColorBarMinMaxAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [currentColorBarMinMax, setCurrentColorBarMinMax] = React.useState<[number, number]>(variableColorBarMinMax);
    const [originalColorBarMinMax, setOriginalColorBarMinMax] = React.useState<[number, number]>(variableColorBarMinMax);
    const colorBarMinMaxEditorOpen = Boolean(colorBarMinMaxAnchorEl);

    if (!colorBars) {
        return null;
    }

    const imageData = colorBars.images[variableColorBarName];

    const handleOpenColorBarMinMaxEditor = (event: React.MouseEvent<HTMLDivElement>) => {
        setColorBarMinMaxAnchorEl(event.currentTarget);
        setCurrentColorBarMinMax(variableColorBarMinMax);
        setOriginalColorBarMinMax(variableColorBarMinMax);
    };

    const handleCloseColorBarMinMaxEditor = () => {
        setColorBarMinMaxAnchorEl(null);
    };

    const handleColorBarMinMaxChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (Array.isArray(value)) {
            setCurrentColorBarMinMax([value[0], value[1]]);
        }
    };

    const handleColorBarMinMaxChangeCommitted = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (Array.isArray(value)) {
            updateVariableColorBar([value[0], value[1]], variableColorBarName);
        }
    };

    const handleOpenColorBarNameEditor = () => {
        console.log("Color bar clicked!");
    };

    const title = `${variableName} (${variableUnits || '-'})`;

    let colorBarMinMaxEditor;
    if (colorBarMinMaxEditorOpen) {
        const [original1, original2] = originalColorBarMinMax;
        let delta = original2 - original1;
        delta = delta > 0 ? delta : 1.0;
        const total1 = original1 - 0.5 * delta;
        const total2 = original2 + 0.5 * delta;

        // const values = arange(total1, total2, 9);
        const values = [
            total1,
            original1,
            original2,
            total2,
        ];

        const marks: Mark[] = getLabelsFromArray(values).map((label, i) => {
            return {value: values[i], label};
        });

        colorBarMinMaxEditor = (
            <div style={{marginTop: 18}}>
                <span style={{paddingLeft: 14}}>{title}</span>
                <Box className={classes.sliderBox}>
                    <Slider
                        min={total1}
                        max={total2}
                        value={currentColorBarMinMax}
                        marks={marks}
                        step={(total2 - total1) / 8}
                        onChange={handleColorBarMinMaxChange}
                        onChangeCommitted={handleColorBarMinMaxChangeCommitted}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </div>
        );
    }

    return (
        <div className={'ol-control ' + classes.container}>
            <div className={classes.title}>
                <span>{title}</span>
            </div>
            <img
                src={`data:image/png;base64,${imageData}`}
                width={width || 240}
                height={height || 24}
                onClick={handleOpenColorBarNameEditor}
            />
            <div
                className={classes.label}
                onClick={handleOpenColorBarMinMaxEditor}
            >
                <Labels minValue={variableColorBarMinMax[0]} maxValue={variableColorBarMinMax[1]}
                        count={numTicks || 5}/>
            </div>
            <Popover
                anchorEl={colorBarMinMaxAnchorEl}
                open={colorBarMinMaxEditorOpen}
                onClose={handleCloseColorBarMinMaxEditor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {colorBarMinMaxEditor}
            </Popover>
        </div>
    );
}


interface LabelsProps {
    minValue: number;
    maxValue: number;
    count: number;
}

function Labels({minValue, maxValue, count}: LabelsProps) {
    return (
        <React.Fragment>
            {getLabelsFromRange(minValue, maxValue, count).map((label, i) => <span key={i}>{label}</span>)}
        </React.Fragment>
    );
}
