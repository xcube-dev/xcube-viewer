/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Switch from "@mui/material/Switch";

import { ControlState } from "@/states/controlState";

interface ToggleSettingProps {
  propertyName: keyof ControlState;
  settings: ControlState;
  updateSettings: (settings: ControlState) => void;
  disabled?: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  propertyName,
  settings,
  updateSettings,
  disabled,
}) => {
  return (
    <Switch
      checked={!!settings[propertyName]}
      onChange={() =>
        updateSettings({ ...settings, [propertyName]: !settings[propertyName] })
      }
      disabled={disabled}
    />
  );
};

export default ToggleSetting;
