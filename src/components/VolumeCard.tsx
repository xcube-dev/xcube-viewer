/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import VolumeIcon from '@material-ui/icons/ThreeDRotation';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React from 'react';
import { Dataset } from '../model/dataset';
import { PlaceInfo } from '../model/place';
import { Variable } from '../model/variable';
import { WithLocale } from '../util/lang';
import { VolumeRenderMode, VolumeState, VolumeStates } from "../states/controlState";
import VolumeCanvas from "./VolumeCanvas";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
// import i18n from '../i18n';


const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        card: {
            maxWidth: '100%',
            marginBottom: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        info: {
            marginRight: theme.spacing(1),
        },
        close: {
            marginLeft: 'auto',
        },
        cardContent: {
            padding: 8,
        },
        isoEditor: {
            display: 'flex',
            flexDirection: 'row'
        },
        isoTextField: {
            maxWidth: '16em',
            marginLeft: '1em'
        },
        isoSlider: {
            width: 100,
        },
    }
));


interface VolumeCardProps extends WithLocale {
    volumeCardOpen: boolean;
    showVolumeCard: (infoCardOpen: boolean) => void;
    selectedDataset: Dataset | null;
    selectedVariable: Variable | null;
    selectedPlaceInfo: PlaceInfo | null;
    volumeId: string | null;
    volumeRenderMode: VolumeRenderMode;
    setVolumeRenderMode: (volumeRenderMode: VolumeRenderMode) => any;
    volumeStates: VolumeStates;
    updateVolumeState: (volumeId: string, volumeState: VolumeState) => any;
    updateVariableVolume: (
        datasetId: string,
        variableName: string,
        volumeRenderMode: VolumeRenderMode,
        volumeIsoThreshold: number,
    ) => any;
}

const VolumeCard: React.FC<VolumeCardProps> = ({
                                                   volumeCardOpen,
                                                   showVolumeCard,
                                                   selectedDataset,
                                                   selectedVariable,
                                                   selectedPlaceInfo,
                                                   volumeId,
                                                   volumeRenderMode,
                                                   setVolumeRenderMode,
                                                   volumeStates,
                                                   updateVolumeState,
                                                   updateVariableVolume,
                                               }) => {

    const classes = useStyles();

    if (!volumeCardOpen) {
        return null;
    }

    let volumeIsoThreshold = 0.5;
    if (selectedVariable) {
        // Move in to selector
        if (typeof selectedVariable.volumeIsoThreshold === 'number') {
            volumeIsoThreshold = selectedVariable.volumeIsoThreshold;
        } else {
            volumeIsoThreshold = 0.5 * (selectedVariable.colorBarMin + selectedVariable.colorBarMax);
        }
        if (typeof selectedVariable.volumeRenderMode === 'string') {
            volumeRenderMode = selectedVariable.volumeRenderMode;
        }
    }

    const setVolumeIsoThreshold = (volumeIsoThreshold: number) => {
        updateVariableVolume(
            selectedDataset!.id,
            selectedVariable!.name,
            volumeRenderMode,
            volumeIsoThreshold,
        );
    }

    const handleVolumeRenderModeChange = (event: React.MouseEvent<HTMLElement>,
                                          volumeRenderMode: VolumeRenderMode) => {
        if (volumeRenderMode !== null) {
            setVolumeRenderMode(volumeRenderMode);
            if (selectedVariable) {
                updateVariableVolume(
                    selectedDataset!.id,
                    selectedVariable!.name,
                    volumeRenderMode,
                    volumeIsoThreshold
                );
            }
        }
    };

    const handleVolumeCardClose = () => {
        showVolumeCard(false);
    };

    return (
        <Card className={classes.card}>
            <CardActions disableSpacing>
                <VolumeIcon fontSize={'large'} className={classes.info}/>
                {selectedVariable && (
                    <>
                        <ToggleButtonGroup
                            key={0}
                            size="small"
                            exclusive={true}
                            value={volumeRenderMode}
                            onChange={handleVolumeRenderModeChange}
                        >
                            <ToggleButton
                                key={0}
                                value="mip"
                            >
                                {/*TODO: I18N*/}
                                <Tooltip arrow title={'Maximum intensity projection'}>
                                    <span>MIP</span>
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton
                                key={1}
                                value="iso"
                            >
                                {/*TODO: I18N*/}
                                <Tooltip arrow title={'Iso-surface extraction'}>
                                    <span>ISO</span>
                                </Tooltip>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {volumeRenderMode === 'iso' && (
                            <IsoThresholdEditor
                                minValue={selectedVariable.colorBarMin}
                                maxValue={selectedVariable.colorBarMax}
                                value={volumeIsoThreshold}
                                setValue={setVolumeIsoThreshold}
                            />
                        )}
                    </>
                )}
                <IconButton key={1} onClick={handleVolumeCardClose} className={classes.close}>
                    {<CloseIcon/>}
                </IconButton>
            </CardActions>
            <CardContent className={classes.cardContent}>
                <VolumeCanvas
                    selectedDataset={selectedDataset}
                    selectedVariable={selectedVariable}
                    selectedPlaceInfo={selectedPlaceInfo}
                    volumeRenderMode={volumeRenderMode}
                    volumeIsoThreshold={volumeIsoThreshold}
                    volumeId={volumeId}
                    volumeStates={volumeStates}
                    updateVolumeState={updateVolumeState}
                />
            </CardContent>
        </Card>
    );
};

export default VolumeCard;


/////////////////////////////////////////////////////////

interface IsoThresholdEditorProps {
    value: number;
    minValue: number;
    maxValue: number;
    setValue: (value: number) => any;
    disabled?: boolean;
}

const IsoThresholdEditor: React.FC<IsoThresholdEditorProps> = (
    {
        value,
        minValue,
        maxValue,
        setValue,
        disabled
    }
) => {
    const classes = useStyles();
    const [sliderValue, setSliderValue] = React.useState<number>(value);
    const [textValue, setTextValue] = React.useState<string>('' + value);
    const [error, setError] = React.useState<string | null>(null);

    function handleTextValueChange(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const textValue = evt.target.value || '';
        setTextValue(textValue);

        const value = parseFloat(textValue);
        if (Number.isNaN(value)) {
            setError("Not a number")
        } else if (value < minValue || value > maxValue) {
            setError("Out of range");
        } else {
            setError(null);
        }
    }

    function handleTextFieldKeyPress(evt: React.KeyboardEvent<HTMLDivElement>) {
        console.log("key", evt.key)
        if (evt.key === "Enter" && !error) {
            const value = parseFloat(textValue);
            setSliderValue(value);
            setValue(value);
        }
    }

    function handleSliderValueChanged(evt: React.ChangeEvent<{}>, value: number | number[]) {
        setSliderValue(value as number);
        setTextValue((value as number).toFixed(2));
    }

    function handleSliderValueCommitted(evt: React.ChangeEvent<{}>, value: number | number[]) {
        setValue(value as number);
    }

    return (
        <TextField
            className={classes.isoTextField}
            disabled={disabled}
            label="Iso-Threshold"
            variant="filled"
            size="small"
            value={textValue}
            error={error !== null}
            onChange={handleTextValueChange}
            onKeyPress={handleTextFieldKeyPress}
            InputProps={{
                endAdornment: (
                    <Slider
                        className={classes.isoSlider}
                        min={minValue}
                        max={maxValue}
                        value={sliderValue}
                        step={(maxValue - minValue) / 20}
                        onChange={handleSliderValueChanged}
                        onChangeCommitted={handleSliderValueCommitted}
                    />
                )
            }}
        />
    );
};