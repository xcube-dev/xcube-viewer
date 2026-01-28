/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Tooltip from "@mui/material/Tooltip";

import { commonSx } from "./styles";

interface InfoCardHeaderProps {
  title: React.ReactNode;
  subheader?: React.ReactNode;
  icon: React.ReactElement;
  tooltipText: string;
}

const InfoCardHeader: React.FC<InfoCardHeaderProps> = ({
  title,
  subheader,
  icon,
  tooltipText,
}) => {
  return (
    <CardHeader
      title={
        <Box sx={commonSx.cardTitle}>
          <Tooltip title={tooltipText}>{icon}</Tooltip>
          {title}
        </Box>
      }
      subheader={subheader}
      sx={commonSx.cardHeader}
    />
  );
};

export default InfoCardHeader;
