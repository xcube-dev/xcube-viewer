/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import FormControl from "@mui/material/FormControl";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { makeStyles } from "@/util/styles";
import { commonStyles } from "@/components/common-styles";
import ToolButton from "@/components/ToolButton";

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  formControl: {
    marginLeft: "auto",
    marginRight: 1,
    marginTop: 2,
    marginBottom: 0,
  },
});

interface ControlBarActionsProps extends WithLocale {
  visible: boolean;
  sidePanelOpen: boolean;
  setSidePanelOpen: (sideBarOpen: boolean) => void;
}

export default function ControlBarActions({
  visible,
  sidePanelOpen,
  setSidePanelOpen,
}: ControlBarActionsProps) {
  if (!visible) {
    return null;
  }

  const sidebarButton = (
    <ToolButton
      sx={commonStyles.toggleButton}
      value={"sidebar"}
      onClick={() => setSidePanelOpen(!sidePanelOpen)}
      tooltipText={i18n.get(sidePanelOpen ? "Hide sidebar" : "Show sidebar")}
      icon={sidePanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    />
  );

  return (
    <FormControl sx={styles.formControl} variant={"standard"}>
      {sidebarButton}
    </FormControl>
  );
}
