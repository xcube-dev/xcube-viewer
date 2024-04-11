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

import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import { ControlState } from "../states/controlState";
import { FormControlLabel } from "@mui/material";

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
