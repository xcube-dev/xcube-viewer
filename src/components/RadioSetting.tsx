/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { FormControlLabel } from "@mui/material";

import { ControlState } from "@/states/controlState";

interface RadioSettingProps {
  propertyName: keyof ControlState;
  settings: ControlState;
  updateSettings: (settings: ControlState) => void;
  options: Array<[string, string | number]>;
  disabled?: boolean;
}

const RadioSetting: React.FC<RadioSettingProps> = ({
  propertyName,
  settings,
  updateSettings,
  options,
  disabled,
}) => {
  const handleChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    updateSettings({ ...settings, [propertyName]: value });
  };
  return (
    <RadioGroup row value={settings[propertyName]} onChange={handleChange}>
      {options.map(([label, value]) => (
        <FormControlLabel
          key={label}
          control={<Radio />}
          value={value}
          label={label}
          disabled={disabled}
        />
      ))}
    </RadioGroup>
  );
};

export default RadioSetting;
