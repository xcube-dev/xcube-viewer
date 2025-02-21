/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { Theme, styled } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

import { WithLocale } from "@/util/lang";

const StyledForm = styled(FormControl)(({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(1),
}));

interface ControlBarItemProps extends WithLocale {
  label: React.ReactNode;
  control: React.ReactNode;
  actions?: React.ReactNode | null;
}

export default function ControlBarItem({
  label,
  control,
  actions,
}: ControlBarItemProps) {
  return (
    <StyledForm variant="standard">
      <Box>
        {label}
        {control}
        {actions}
      </Box>
    </StyledForm>
  );
}
