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
import { makeStyles } from "@/util/styles";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import CompareIcon from "@mui/icons-material/Compare";
import TimelineIcon from "@mui/icons-material/Timeline";

import i18n from "@/i18n";
import { Variable } from "@/model/variable";
import { WithLocale } from "@/util/lang";
import ControlBarItem from "./ControlBarItem";
import { commonStyles } from "@/components/common-styles";
import { SxProps } from "@mui/system";

const styles = makeStyles({
  button: (theme) => ({
    margin: theme.spacing(0.1),
  }),
});

const toggleComparisonStyle = {
  ...styles.button,
  ...commonStyles.toggleButton,
} as SxProps;

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
}: VariableSelectProps) {
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
          {getVariableLabel(
            variable,
            selectedDatasetId,
            selectedDataset2Id,
            selectedVariable2Name,
          )}
        </MenuItem>
      ))}
    </Select>
  );
  const timeSeriesButton = (
    <IconButton
      key={"timeSeries"}
      sx={styles.button}
      disabled={!canAddTimeSeries}
      onClick={handleAddTimeSeriesButtonClick}
    >
      <Tooltip arrow title={i18n.get("Show time-series diagram")}>
        {<TimelineIcon />}
      </Tooltip>
    </IconButton>
  );
  const variable2Button = (
    <ToggleButton
      key={"variable2"}
      selected={isSelectedVariable2}
      value={"comparison"}
      size="small"
      sx={toggleComparisonStyle}
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
      actions={[timeSeriesButton, variable2Button]}
    />
  );
}

function getVariableLabel(
  variable: Variable,
  datasetId: string | null,
  dataset2Id: string | null,
  variable2Name: string | null,
) {
  const label = variable.title || variable.name;
  if (datasetId === dataset2Id && variable.name === variable2Name) {
    return `${label} (#2)`;
  }
  return label;
}
