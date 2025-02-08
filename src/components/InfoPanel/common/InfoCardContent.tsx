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
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import JsonIcon from "@mui/icons-material/DataObject";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import i18n from "@/i18n";
import pythonLogo from "@/resources/python-bw.png";
import { commonStyles } from "@/components/common-styles";
import { commonSx } from "./styles";
import { ViewMode } from "./types";

interface InfoCardContentProps {
  isIn: boolean;
  title: React.ReactNode;
  subheader?: React.ReactNode;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  hasPython?: boolean;
  children?: React.ReactNode;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  isIn,
  title,
  subheader,
  viewMode,
  setViewMode,
  hasPython,
  children,
}) => {
  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    viewMode: ViewMode,
  ) => {
    setViewMode(viewMode);
  };

  return (
    <Collapse in={isIn} timeout="auto" unmountOnExit>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={commonSx.cardHeader}
        titleTypographyProps={{ fontSize: "1.1em" }}
        subheaderTypographyProps={{ fontSize: "0.8em" }}
        action={
          <ToggleButtonGroup
            key={0}
            size="small"
            value={viewMode}
            exclusive={true}
            onChange={handleViewModeChange}
          >
            <ToggleButton
              key={0}
              value="text"
              size="small"
              sx={commonStyles.toggleButton}
            >
              <Tooltip arrow title={i18n.get("Textual format")}>
                <TextFieldsIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              key={1}
              value="list"
              size="small"
              sx={commonStyles.toggleButton}
            >
              <Tooltip arrow title={i18n.get("Tabular format")}>
                <ListAltIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              key={2}
              value="code"
              size="small"
              sx={commonStyles.toggleButton}
            >
              <Tooltip arrow title={i18n.get("JSON format")}>
                <JsonIcon />
              </Tooltip>
            </ToggleButton>
            {hasPython && (
              <ToggleButton
                key={3}
                value="python"
                size="small"
                sx={{ ...commonStyles.toggleButton, width: "30px" }}
              >
                <img src={pythonLogo} width={16} alt="python logo" />
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        }
      />
      {children}
    </Collapse>
  );
};

export default InfoCardContent;
