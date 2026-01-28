/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
  card: {
    maxWidth: "100%",
    marginBottom: 1,
    marginRight: 1,
  },
  cardContent: {
    padding: 0.1,
  },
  isoTextField: {
    marginLeft: 1,
    flexGrow: 1,
  },
  isoSlider: {
    minWidth: 100,
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
