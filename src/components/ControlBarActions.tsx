/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme, styled } from "@mui/system";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { commonStyles } from "@/components/common-styles";
import ToolButton from "@/components/ToolButton";

// noinspection JSUnusedLocalSymbols
const StyledFormControl = styled(FormControl)(
  ({ theme }: { theme: Theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: 0,
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
    <ToolButton
      sx={commonStyles.toggleButton}
      toggle={true}
      selected={sidebarOpen}
      value={"sidebar"}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      tooltipText={i18n.get("Show or hide sidebar")}
      icon={<ViewSidebarIcon />}
    />
  );

  return (
    <StyledFormControl variant="standard">
      <Box>{sidebarButton}</Box>
    </StyledFormControl>
  );
}
