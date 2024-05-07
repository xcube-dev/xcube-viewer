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

import * as React from "react";
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Tooltip from "@mui/material/Tooltip";
import CompareIcon from "@mui/icons-material/Compare";
import TimelineIcon from "@mui/icons-material/Timeline";

import i18n from "@/i18n";
import { Variable } from "@/model/variable";
import { WithLocale } from "@/util/lang";
import ControlBarItem from "./ControlBarItem";

const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {},
    button: {
      margin: theme.spacing(0.1),
    },
  });

interface VariableSelectProps extends WithStyles<typeof styles>, WithLocale {
  selectedDatasetId: string | null;
  selectedDataset2Id: string | null;
  selectedVariableName: string | null;
  selectedVariable2Name: string | null;
  canAddTimeSeries: boolean;
  variables: Variable[];
  selectVariable: (variableName: string | null) => void;
  selectVariable2: (
    dataset2Id: string | null,
    variable2Name: string | null,
  ) => void;
  addTimeSeries: () => void;
}

const _VariableSelect: React.FC<VariableSelectProps> = ({
  classes,
  canAddTimeSeries,
  selectedDatasetId,
  selectedVariableName,
  selectedDataset2Id,
  selectedVariable2Name,
  variables,
  selectVariable,
  selectVariable2,
  addTimeSeries,
}) => {
  const handleVariableChange = (event: SelectChangeEvent) => {
    selectVariable(event.target.value || null);
  };

  const handleAddTimeSeriesButtonClick = () => {
    addTimeSeries();
  };

  const isSelectedVariable2 =
    selectedDatasetId === selectedDataset2Id &&
    selectedVariableName === selectedVariable2Name;

  const variableSelectLabel = (
    <InputLabel shrink htmlFor="variable-select">
      {i18n.get("Variable")}
    </InputLabel>
  );

  const variableSelect = (
    <Select
      variant="standard"
      className={classes.selectEmpty}
      value={selectedVariableName || ""}
      onChange={handleVariableChange}
      input={<Input name="variable" id="variable-select" />}
      displayEmpty
      name="variable"
    >
      {(variables || []).map((variable) => (
        <MenuItem
          key={variable.name}
          value={variable.name}
          selected={variable.name === selectedVariableName}
        >
          {variable.title || variable.name}
        </MenuItem>
      ))}
    </Select>
  );
  const timeSeriesButton = (
    <IconButton
      key={"timeSeries"}
      className={classes.button}
      disabled={!canAddTimeSeries}
      onClick={handleAddTimeSeriesButtonClick}
    >
      <Tooltip arrow title={i18n.get("Show time-series diagram")}>
        {<TimelineIcon />}
      </Tooltip>
    </IconButton>
  );
  const variable2Button = (
    <IconButton
      key={"variable2"}
      className={classes.button}
      color={isSelectedVariable2 ? "success" : "default"}
      onClick={() => selectVariable2(selectedDatasetId, selectedVariableName)}
    >
      <Tooltip arrow title={i18n.get("Variable 2 (for comparison)")}>
        {<CompareIcon />}
      </Tooltip>
    </IconButton>
  );

  return (
    <ControlBarItem
      label={variableSelectLabel}
      control={variableSelect}
      actions={[timeSeriesButton, variable2Button]}
    />
  );
};

const VariableSelect = withStyles(styles)(_VariableSelect);
export default VariableSelect;
