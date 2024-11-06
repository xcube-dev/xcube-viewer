/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {
  Component,
  ContributionState,
  handleComponentChange,
} from "dashipopashi";

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
