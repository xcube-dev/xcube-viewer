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
