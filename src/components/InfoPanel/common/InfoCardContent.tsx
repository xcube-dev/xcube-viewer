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
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Tooltip from "@mui/material/Tooltip";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { commonSx } from "./styles";
import { ViewMode } from "./types";
import InfoCardActions from "./InfoCardActions";

interface InfoCardContentProps {
  expanded: boolean;
  onExpandedStateChange: (expanded: boolean) => void;
  title: React.ReactNode;
  subheader?: React.ReactNode;
  icon: React.ReactElement;
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
    <Accordion
      expanded={expanded}
      onChange={(_, expanded) => onExpandedStateChange(expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0 8px" }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title={tooltipText}>{icon}</Tooltip>
              {title}
            </Box>
          }
          subheader={subheader}
          sx={{ ...commonSx.cardHeader }}
          titleTypographyProps={{ fontSize: "1.1em" }}
          subheaderTypographyProps={{ fontSize: "0.8em" }}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 8px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <InfoCardActions
            viewMode={viewMode}
            setViewMode={setViewMode}
            hasPython={hasPython}
          />
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default InfoCardContent;
