import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Popover from '@material-ui/core/Popover';
import Slider, { Mark } from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';

import { getLabelsFromArray, getLabelsFromRange } from '../util/label'
import { ColorBars } from '../model/colorBar';
import { I18N } from '../config';

const HOR_SLIDER_MARGIN = 5;
const COLOR_BAR_BOX_MARGIN = 1;
const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

const ALPHA_SUFFIX = '_alpha';

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
            marginLeft: theme.spacing(HOR_SLIDER_MARGIN),
            marginRight: theme.spacing(HOR_SLIDER_MARGIN),
            minWidth: 300,
            width: `calc(100% - ${theme.spacing(2 * (HOR_SLIDER_MARGIN + 1))}px)`,
        },
        colorBarBox: {
            marginTop: theme.spacing(COLOR_BAR_BOX_MARGIN - 2 * COLOR_BAR_ITEM_BOX_MARGIN),
            marginLeft: theme.spacing(COLOR_BAR_BOX_MARGIN),
            marginRight: theme.spacing(COLOR_BAR_BOX_MARGIN),
            marginBottom: theme.spacing(COLOR_BAR_BOX_MARGIN),
        },
        colorBarGroupTitle: {
            marginTop: theme.spacing(2 * COLOR_BAR_ITEM_BOX_MARGIN),
            color: theme.palette.grey[400],
        },
        colorBarGroupItemBox: {
            marginTop: theme.spacing(COLOR_BAR_ITEM_BOX_MARGIN),
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
                                           numTicks
                                       }: ColorBarLegendProps) {
    const classes = useStyles();
    const [colorBarMinMaxAnchorEl, setColorBarMinMaxAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [colorBarNameAnchorEl, setColorBarNameAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const [currentColorBarMinMax, setCurrentColorBarMinMax] = React.useState<[number, number]>(variableColorBarMinMax);
    const [originalColorBarMinMax, setOriginalColorBarMinMax] = React.useState<[number, number]>(variableColorBarMinMax);
    const colorBarMinMaxEditorOpen = Boolean(colorBarMinMaxAnchorEl);
    const colorBarNameEditorOpen = Boolean(colorBarNameAnchorEl);

    if (!colorBars) {
        return null;
    }

    const variableColorBarAlpha = variableColorBarName.endsWith(ALPHA_SUFFIX);
    let variableColorBarBaseName = variableColorBarName;
    if (variableColorBarAlpha) {
        variableColorBarBaseName = variableColorBarName.slice(0, variableColorBarName.length - ALPHA_SUFFIX.length);
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

    const handleOpenColorBarNameEditor = (event: React.MouseEvent<HTMLDivElement>) => {
        setColorBarNameAnchorEl(event.currentTarget);
    };

    const handleCloseColorBarNameEditor = () => {
        setColorBarNameAnchorEl(null);
    };

    const handleColorBarNameChange = (variableColorBarName: string) => {
        if (variableColorBarAlpha) {
            variableColorBarName += ALPHA_SUFFIX;
        }
        updateVariableColorBar(variableColorBarMinMax, variableColorBarName);
    };

    const handleColorBarAlpha = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.checked) {
            updateVariableColorBar(variableColorBarMinMax, variableColorBarBaseName + ALPHA_SUFFIX);
        } else {
            updateVariableColorBar(variableColorBarMinMax, variableColorBarBaseName);
        }
    };

    const title = `${variableName} (${variableUnits || '-'})`;

    let colorBarMinMaxEditor;
    if (colorBarMinMaxEditorOpen) {

        const [original1, original2] = originalColorBarMinMax;
        const dist = original1 < original2 ? (original2 - original1) : 1;
        const distExp = Math.floor(Math.log10(dist));
        const distNorm = dist * Math.pow(10, -distExp);

        let numStepsInner = null;
        for (let delta of [0.25, 0.2, 0.15, 0.125, 0.1]) {
            let numStepsFloat = distNorm / delta;
            let numStepsInt = Math.floor(numStepsFloat);
            if (Math.abs(numStepsInt - numStepsFloat) < 1e-10) {
                numStepsInner = numStepsInt;
                break;
            }
        }

        let numStepsOuter;
        if (numStepsInner !== null && numStepsInner >= 2) {
            numStepsOuter = Math.max(2, Math.round(numStepsInner / 2));
        } else {
            numStepsOuter = 4;
            numStepsInner = 8;
        }

        const delta = original1 < original2 ? dist / numStepsInner : 0.5;
        const numSteps = numStepsInner + 2 * numStepsOuter;
        const total1 = original1 - numStepsOuter * delta;
        const total2 = original2 + numStepsOuter * delta;
        const step = (total2 - total1) / numSteps;

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
                        step={step}
                        onChange={handleColorBarMinMaxChange}
                        onChangeCommitted={handleColorBarMinMaxChangeCommitted}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </div>
        );
    }

    let colorBarNameEditor;
    if (colorBarNameEditorOpen) {
        let key = 0;
        const entries = [];
        for (let cbg of colorBars.groups) {
            if (!cbg.names || cbg.names.length === 0) {
                continue;
            }
            entries.push(
                <Tooltip key={key++} title={cbg.description} placement="left">
                    <Box className={classes.colorBarGroupTitle}>
                        {cbg.title}
                    </Box>
                </Tooltip>
            );
            for (let name of cbg.names) {
                if (!name.endsWith(ALPHA_SUFFIX)) {
                    entries.push(
                        <Box
                            key={key++}
                            className={classes.colorBarGroupItemBox}
                            border={name === variableColorBarBaseName ? 1 : 1}
                            borderColor={name === variableColorBarBaseName ? 'orange' : 'black'}
                            width={240}
                            height={20}
                        >
                            <Tooltip title={name} placement="left">
                                <img
                                    src={`data:image/png;base64,${colorBars.images[name]}`}
                                    width={'100%'}
                                    height={'100%'}
                                    onClick={() => {
                                        handleColorBarNameChange(name);
                                    }}
                                />
                            </Tooltip>
                        </Box>
                    );
                }
            }
        }
        colorBarNameEditor = (
            <Box className={classes.colorBarBox}>
                <Box component="span">
                    <Checkbox color="primary"
                              checked={variableColorBarAlpha}
                              onChange={handleColorBarAlpha}/>
                    <Box component="span">{I18N.get('Hide lower values')}</Box>
                </Box>
                {entries}
            </Box>
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
            <Popover
                anchorEl={colorBarNameAnchorEl}
                open={colorBarNameEditorOpen}
                onClose={handleCloseColorBarNameEditor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {colorBarNameEditor}
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
