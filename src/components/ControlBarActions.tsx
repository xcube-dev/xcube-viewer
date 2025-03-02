/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme, styled } from "@mui/system";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { commonStyles } from "@/components/common-styles";

// noinspection JSUnusedLocalSymbols
const StyledFormControl = styled(FormControl)(
  ({ theme }: { theme: Theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    marginLeft: "auto",
  }),
);

interface ControlBarActionsProps extends WithLocale {
  visible: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (sideBarOpen: boolean) => void;
}

export default function ControlBarActions({
  visible,
  sidebarOpen,
  setSidebarOpen,
}: ControlBarActionsProps) {
  if (!visible) {
    return null;
  }

  const sidebarButton = (
    <ToggleButton
      value={"sidebar"}
      selected={sidebarOpen}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      size="small"
      sx={commonStyles.toggleButton}
    >
      <Tooltip arrow title={i18n.get("Show or hide sidebar")}>
        {<ViewSidebarIcon />}
      </Tooltip>
    </ToggleButton>
  );

  return (
    <StyledFormControl variant="standard">
      <Box>{sidebarButton}</Box>
    </StyledFormControl>
  );
}
