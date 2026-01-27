/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { Theme, styled, SxProps } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import { WithLocale } from "@/util/lang";

const StyledForm = styled(FormControl)(({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(2),
}));

interface ControlBarItemProps extends WithLocale {
  label: React.ReactNode;
  control: React.ReactNode;
  actions?: React.ReactNode | null;
  sx?: SxProps;
}

export default function ControlBarItem({
  label,
  control,
  actions,
  sx,
}: ControlBarItemProps) {
  return (
    <StyledForm variant="standard" sx={sx}>
      <Box>
        {label}
        {control}
        {actions}
      </Box>
    </StyledForm>
  );
}
