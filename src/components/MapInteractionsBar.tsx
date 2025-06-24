/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import FormControl from "@mui/material/FormControl";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CategoryIcon from "@mui/icons-material/Category";
// import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FileUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

import i18n from "@/i18n";
import { MapInteraction } from "@/states/controlState";
import { WithLocale } from "@/util/lang";
import { commonStyles } from "@/components/common-styles";
import { MessageType } from "@/states/messageLogState";
import MapSnapshotButton from "./MapSnapshotButton";

const StyledFromControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(2),
}));

interface MapInteractionsBarProps extends WithLocale {
  mapInteraction: MapInteraction;
  setMapInteraction: (interaction: MapInteraction) => void;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function MapInteractionsBar({
  mapInteraction,
  setMapInteraction,
  postMessage
}: MapInteractionsBarProps) {
  function handleChange(
    _event: React.MouseEvent<HTMLElement>,
    value: MapInteraction | null,
  ) {
    if (value !== null) {
      setMapInteraction(value);
    } else {
      setMapInteraction("Select");
    }
  }

  return (
    <StyledFromControl variant="standard">
      <ToggleButtonGroup
        size="small"
        value={mapInteraction}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton
          key={0}
          value="Select"
          size="small"
          sx={commonStyles.toggleButton}
        >
          <Tooltip arrow title={i18n.get("Select a place in map")}>
            <AdsClickIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          key={1}
          value="Point"
          size="small"
          sx={commonStyles.toggleButton}
        >
          <Tooltip arrow title={i18n.get("Add a point location in map")}>
            <AddLocationIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          key={2}
          value="Polygon"
          size="small"
          sx={commonStyles.toggleButton}
        >
          <Tooltip arrow title={i18n.get("Draw a polygon area in map")}>
            <CategoryIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          key={3}
          value="Circle"
          size="small"
          sx={commonStyles.toggleButton}
        >
          <Tooltip arrow title={i18n.get("Draw a circular area in map")}>
            <FiberManualRecordIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          key={4}
          value="Geometry"
          size="small"
          sx={commonStyles.toggleButton}
        >
          <Tooltip arrow title={i18n.get("Import places")}>
            <FileUploadIcon />
          </Tooltip>
        </ToggleButton>
        <MapSnapshotButton mapRef={"map"} postMessage={postMessage} fontSize="medium" isToggle={true} />
      </ToggleButtonGroup>
    </StyledFromControl>
  );
}
