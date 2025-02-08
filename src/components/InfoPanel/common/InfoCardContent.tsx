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
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { commonStyles } from "@/components/common-styles";
import { commonSx } from "./styles";
import { ViewMode } from "./types";
import InfoCardActions from "./InfoCardActions";

interface InfoCardContentProps {
  expanded: boolean;
  onExpandedStateChange: (expanded: boolean) => void;
  title: React.ReactNode;
  subheader?: React.ReactNode;
  icon?: React.ReactNode;
  tooltipText: string;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  hasPython?: boolean;
  children?: React.ReactNode;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  expanded,
  onExpandedStateChange,
  title,
  subheader,
  icon,
  tooltipText,
  viewMode,
  setViewMode,
  hasPython,
  children,
}) => {
  return (
    <Box>
      <CardHeader
        title={
          <Tooltip arrow title={tooltipText}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {icon}
              {title}
            </Box>
          </Tooltip>
        }
        subheader={subheader}
        sx={commonSx.cardHeader}
        titleTypographyProps={{ fontSize: "1.1em" }}
        subheaderTypographyProps={{ fontSize: "0.8em" }}
        action={
          <Box sx={{ display: "flex", gap: 0.3 }}>
            {expanded && (
              <InfoCardActions
                viewMode={viewMode}
                setViewMode={setViewMode}
                hasPython={hasPython}
              />
            )}
            <IconButton
              onClick={() => onExpandedStateChange(!expanded)}
              value="code"
              size="small"
              sx={commonStyles.toggleButton}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Box>
  );
};

export default InfoCardContent;
