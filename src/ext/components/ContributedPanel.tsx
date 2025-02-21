/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Component, ContributionState, handleComponentChange } from "chartlets";

interface ContributedPanelState {
  title: string;
  visible?: boolean;
}

interface ContributedPanelProps {
  contribution: ContributionState<ContributedPanelState>;
  panelIndex: number;
}

const ContributedPanel: React.FC<ContributedPanelProps> = ({
  contribution,
  panelIndex,
}) => {
  const componentStateResult = contribution.componentResult;
  if (componentStateResult.status === "pending") {
    return <CircularProgress key={contribution.name} />;
  } else if (componentStateResult.error) {
    return (
      <div key={contribution.name}>
        <Typography color="error">
          {componentStateResult.error.message}
        </Typography>
      </div>
    );
  } else if (contribution.component) {
    return (
      <Component
        key={contribution.name}
        {...contribution.component}
        onChange={(event) => {
          handleComponentChange("panels", panelIndex, event);
        }}
      />
    );
  }
  return null;
};

export default ContributedPanel;
