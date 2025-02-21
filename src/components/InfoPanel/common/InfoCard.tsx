/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { ViewMode } from "./types";
import InfoCardActions from "./InfoCardActions";
import InfoCardHeader from "./InfoCardHeader";

interface InfoCardProps {
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

const InfoCard: React.FC<InfoCardProps> = ({
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
        <InfoCardHeader
          title={title}
          icon={icon}
          subheader={subheader}
          tooltipText={tooltipText}
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

export default InfoCard;
