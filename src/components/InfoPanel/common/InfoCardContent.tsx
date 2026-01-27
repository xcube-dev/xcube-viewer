/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import MuiCardContent from "@mui/material/CardContent";

import { commonSx } from "./styles";

interface InfoCardContentProps {
  children: React.ReactNode;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({ children }) => {
  return <MuiCardContent sx={commonSx.cardContent}>{children}</MuiCardContent>;
};

export default InfoCardContent;
