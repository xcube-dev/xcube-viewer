/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

import React, { SyntheticEvent } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";

import { Dataset } from "@/model/dataset";
import { PlaceInfo } from "@/model/place";
import { Variable } from "@/model/variable";
import { WithLocale } from "@/util/lang";
import {
  VolumeRenderMode,
  VolumeState,
  VolumeStates,
} from "@/states/controlState";
import { ColorBar } from "@/model/colorBar";
import VolumeCanvas from "./VolumeCanvas";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  card: (theme) => ({
    maxWidth: "100%",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  }),
  info: (theme) => ({
    marginRight: theme.spacing(1),
  }),
  close: {
    marginLeft: "auto",
  },
  cardContent: {
    padding: 8,
  },
  isoEditor: {
    display: "flex",
    flexDirection: "row",
  },
  isoTextField: {
    minWidth: "16em",
    marginLeft: "1em",
  },
  isoSlider: {
    minWidth: 200,
  },
});

interface VolumePanelProps extends WithLocale {
  selectedDataset: Dataset | null;
  selectedVariable: Variable | null;
  selectedPlaceInfo: PlaceInfo | null;
  variableColorBar: ColorBar;
  volumeId: string | null;
  volumeRenderMode: VolumeRenderMode;
  setVolumeRenderMode: (volumeRenderMode: VolumeRenderMode) => void;
  volumeStates: VolumeStates;
  updateVolumeState: (volumeId: string, volumeState: VolumeState) => void;
  updateVariableVolume: (
    datasetId: string,
    variableName: string,
    variableColorBar: ColorBar,
    volumeRenderMode: VolumeRenderMode,
    volumeIsoThreshold: number,
  ) => void;
  serverUrl: string;
}

const VolumePanel: React.FC<VolumePanelProps> = ({
  selectedDataset,
  selectedVariable,
  selectedPlaceInfo,
  variableColorBar,
  volumeId,
  volumeRenderMode,
  setVolumeRenderMode,
  volumeStates,
  updateVolumeState,
  updateVariableVolume,
  serverUrl,
}) => {
  let volumeIsoThreshold = 0.5;
  if (selectedVariable) {
    // Move in to selector
    if (typeof selectedVariable.volumeIsoThreshold === "number") {
      volumeIsoThreshold = selectedVariable.volumeIsoThreshold;
    } else {
      volumeIsoThreshold =
        0.5 * (selectedVariable.colorBarMin + selectedVariable.colorBarMax);
    }
    if (typeof selectedVariable.volumeRenderMode === "string") {
      volumeRenderMode = selectedVariable.volumeRenderMode;
    }
  }

  const setVolumeIsoThreshold = (volumeIsoThreshold: number) => {
    updateVariableVolume(
      selectedDataset!.id,
      selectedVariable!.name,
      variableColorBar,
      volumeRenderMode,
      volumeIsoThreshold,
    );
  };

  const handleVolumeRenderModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    volumeRenderMode: VolumeRenderMode,
  ) => {
    if (volumeRenderMode !== null) {
      setVolumeRenderMode(volumeRenderMode);
      if (selectedVariable) {
        updateVariableVolume(
          selectedDataset!.id,
          selectedVariable!.name,
          variableColorBar,
          volumeRenderMode,
          volumeIsoThreshold,
        );
      }
    }
  };

  return (
    <Card sx={styles.card}>
      <CardActions disableSpacing>
        {selectedVariable && (
          <>
            <ToggleButtonGroup
              key={0}
              size="small"
              exclusive={true}
              value={volumeRenderMode}
              onChange={handleVolumeRenderModeChange}
            >
              <ToggleButton key="mip" value="mip" size="small">
                {/*TODO: I18N*/}
                <Tooltip arrow title={"Maximum intensity projection"}>
                  <span>MIP</span>
                </Tooltip>
              </ToggleButton>
              <ToggleButton key="aip" value="aip" size="small">
                {/*TODO: I18N*/}
                <Tooltip arrow title={"Average intensity projection"}>
                  <span>AIP</span>
                </Tooltip>
              </ToggleButton>
              <ToggleButton key="iso" value="iso" size="small">
                {/*TODO: I18N*/}
                <Tooltip arrow title={"Iso-surface extraction"}>
                  <span>ISO</span>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            {volumeRenderMode === "iso" && (
              <IsoThresholdEditor
                minValue={selectedVariable.colorBarMin}
                maxValue={selectedVariable.colorBarMax}
                value={volumeIsoThreshold}
                setValue={setVolumeIsoThreshold}
              />
            )}
          </>
        )}
      </CardActions>
      <CardContent sx={styles.cardContent}>
        <VolumeCanvas
          selectedDataset={selectedDataset}
          selectedVariable={selectedVariable}
          selectedPlaceInfo={selectedPlaceInfo}
          variableColorBar={variableColorBar}
          volumeRenderMode={volumeRenderMode}
          volumeIsoThreshold={volumeIsoThreshold}
          volumeId={volumeId}
          volumeStates={volumeStates}
          updateVolumeState={updateVolumeState}
          serverUrl={serverUrl}
        />
      </CardContent>
    </Card>
  );
};

export default VolumePanel;

interface IsoThresholdEditorProps {
  value: number;
  minValue: number;
  maxValue: number;
  setValue: (value: number) => void;
  disabled?: boolean;
}

const IsoThresholdEditor: React.FC<IsoThresholdEditorProps> = ({
  value,
  minValue,
  maxValue,
  setValue,
  disabled,
}) => {
  const [sliderValue, setSliderValue] = React.useState<number>(value);
  const [textValue, setTextValue] = React.useState<string>("" + value);
  const [error, setError] = React.useState<string | null>(null);

  function handleTextValueChange(
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const textValue = evt.target.value || "";
    setTextValue(textValue);

    const value = parseFloat(textValue);
    if (Number.isNaN(value)) {
      setError("Not a number");
    } else if (value < minValue || value > maxValue) {
      setError("Out of range");
    } else {
      setError(null);
    }
  }

  function handleTextFieldKeyPress(evt: React.KeyboardEvent<HTMLDivElement>) {
    if (evt.key === "Enter" && !error) {
      const value = parseFloat(textValue);
      setSliderValue(value);
      setValue(value);
    }
  }

  function handleSliderValueChanged(_evt: Event, value: number | number[]) {
    setSliderValue(value as number);
    setTextValue((value as number).toFixed(2));
  }

  function handleSliderValueCommitted(
    _evt: Event | SyntheticEvent,
    value: number | number[],
  ) {
    setValue(value as number);
  }

  return (
    <TextField
      sx={styles.isoTextField}
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
            size={"small"}
            sx={styles.isoSlider}
            min={minValue}
            max={maxValue}
            value={sliderValue}
            step={(maxValue - minValue) / 20}
            onChange={handleSliderValueChanged}
            onChangeCommitted={handleSliderValueCommitted}
          />
        ),
      }}
    />
  );
};
