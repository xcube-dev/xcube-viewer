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

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import CalculateIcon from "@mui/icons-material/Calculate";
import CompareIcon from "@mui/icons-material/Compare";
import TimelineIcon from "@mui/icons-material/Timeline";

import i18n from "@/i18n";
import { Variable } from "@/model/variable";
import { WithLocale } from "@/util/lang";
import { commonStyles } from "@/components/common-styles";
import ToolButton from "@/components/ToolButton";
import { USER_VARIABLES_DIALOG_ID } from "@/components/UserVariablesDialog/utils";
import ControlBarItem from "./ControlBarItem";
import { isUserVariable } from "@/model/userVariable";

interface VariableSelectProps extends WithLocale {
  selectedDatasetId: string | null;
  selectedDataset2Id: string | null;
  selectedVariableName: string | null;
  selectedVariable2Name: string | null;
  variables: Variable[];
  canAddTimeSeries: boolean;
  addTimeSeries: () => void;
  selectVariable: (variableName: string | null) => void;
  selectVariable2: (
    dataset2Id: string | null,
    variable2Name: string | null,
  ) => void;
  openDialog: (dialogId: string) => void;
}

export default function VariableSelect({
  selectedDatasetId,
  selectedVariableName,
  selectedDataset2Id,
  selectedVariable2Name,
  variables,
  canAddTimeSeries,
  addTimeSeries,
  selectVariable,
  selectVariable2,
  openDialog,
}: VariableSelectProps) {
  const handleVariableChange = (event: SelectChangeEvent) => {
    selectVariable(event.target.value || null);
  };

  const handleManageUserVariablesClick = () => {
    openDialog(USER_VARIABLES_DIALOG_ID);
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

  function getVariableLabel(variable: Variable | undefined) {
    if (!variable) {
      return "?";
    }
    const label = variable.title || variable.name;
    if (
      selectedDatasetId === selectedDataset2Id &&
      variable.name === selectedVariable2Name
    ) {
      return `${label} (#2)`;
    }
    return label;
  }

  const variableSelect = (
    <Select
      variant="standard"
      value={selectedVariableName || ""}
      onChange={handleVariableChange}
      input={<Input name="variable" id="variable-select" />}
      displayEmpty
      name="variable"
      renderValue={() =>
        getVariableLabel(variables.find((v) => v.name === selectedVariableName))
      }
    >
      {(variables || []).map((variable) => (
        <MenuItem
          key={variable.name}
          value={variable.name}
          selected={variable.name === selectedVariableName}
        >
          {isUserVariable(variable) && (
            <ListItemIcon>
              <CalculateIcon fontSize="small" />
            </ListItemIcon>
          )}
          <ListItemText>{getVariableLabel(variable)}</ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
  const manageUserVariablesButton = (
    <ToolButton
      key={"userVariables"}
      onClick={handleManageUserVariablesClick}
      tooltipText={i18n.get("Add/manage user-defined variables")}
      icon={<CalculateIcon />}
    />
  );
  const addTimeSeriesButton = (
    <ToolButton
      key={"timeSeries"}
      disabled={!canAddTimeSeries}
      onClick={handleAddTimeSeriesButtonClick}
      tooltipText={i18n.get("Show time-series diagram")}
      icon={<TimelineIcon />}
    />
  );
  const variable2Button = (
    <ToggleButton
      key={"variable2"}
      selected={isSelectedVariable2}
      value={"comparison"}
      size="small"
      sx={commonStyles.toggleButton}
      onClick={() => selectVariable2(selectedDatasetId, selectedVariableName)}
    >
      <Tooltip arrow title={i18n.get("Make it 2nd variable for comparison")}>
        {<CompareIcon />}
      </Tooltip>
    </ToggleButton>
  );

  return (
    <ControlBarItem
      label={variableSelectLabel}
      control={variableSelect}
      actions={[
        manageUserVariablesButton,
        addTimeSeriesButton,
        variable2Button,
      ]}
    />
  );
}
