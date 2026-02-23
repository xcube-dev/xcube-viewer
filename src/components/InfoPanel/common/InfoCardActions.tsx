/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import JsonIcon from "@mui/icons-material/DataObject";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import i18n from "@/i18n";
import pythonLogo from "@/resources/python-bw.png";
import { type ViewMode } from "./types";
import { commonSx } from "./styles";

interface InfoCardActionsProps {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  hasPython?: boolean;
}

const InfoCardActions: React.FC<InfoCardActionsProps> = ({
  viewMode,
  setViewMode,
  hasPython,
}) => {
  return (
    <ToggleButtonGroup
      key={0}
      size="small"
      value={viewMode}
      exclusive={true}
      onChange={(_, viewMode) => setViewMode(viewMode)}
    >
      <ToggleButton key="text" value="text" sx={commonSx.toggleButton}>
        <Tooltip arrow title={i18n.get("Textual format")}>
          <TextFieldsIcon fontSize="inherit" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton key="list" value="list" sx={commonSx.toggleButton}>
        <Tooltip arrow title={i18n.get("Tabular format")}>
          <ListAltIcon fontSize="inherit" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton key="json" value="code" sx={commonSx.toggleButton}>
        <Tooltip arrow title={i18n.get("JSON format")}>
          <JsonIcon fontSize="inherit" />
        </Tooltip>
      </ToggleButton>
      {hasPython && (
        <ToggleButton
          key="python"
          value="python"
          sx={{ ...commonSx.toggleButton, width: "30px" }}
        >
          <img src={pythonLogo} width={12} alt="python logo" />
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

export default InfoCardActions;
