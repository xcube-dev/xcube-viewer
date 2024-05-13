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
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import i18n from "@/i18n";
import { Dataset } from "@/model/dataset";
import { WithLocale } from "@/util/lang";
import ToolButton from "@/components/ToolButton";
import ControlBarItem from "./ControlBarItem";

interface DatasetSelectProps extends WithLocale {
  selectedDatasetId: string | null;
  datasets: Dataset[];
  selectDataset: (
    datasetId: string | null,
    datasets: Dataset[],
    showInMap: boolean,
  ) => void;
  locateSelectedDataset: () => void;
}

export default function DatasetSelect({
  selectedDatasetId,
  datasets,
  selectDataset,
  locateSelectedDataset,
}: DatasetSelectProps) {
  const handleDatasetChange = (event: SelectChangeEvent) => {
    const datasetId = event.target.value || null;
    selectDataset(datasetId, datasets, true);
  };

  selectedDatasetId = selectedDatasetId || "";
  datasets = datasets || [];

  const datasetSelectLabel = (
    <InputLabel shrink htmlFor="dataset-select">
      {i18n.get("Dataset")}
    </InputLabel>
  );

  const datasetSelect = (
    <Select
      variant="standard"
      value={selectedDatasetId}
      onChange={handleDatasetChange}
      input={<Input name="dataset" id="dataset-select" />}
      displayEmpty
      name="dataset"
    >
      {datasets.map((dataset) => (
        <MenuItem
          key={dataset.id}
          value={dataset.id}
          selected={dataset.id === selectedDatasetId}
        >
          {dataset.title}
        </MenuItem>
      ))}
    </Select>
  );

  const locateDatasetButton = (
    <ToolButton
      onClick={locateSelectedDataset}
      tooltipText={i18n.get("Locate dataset in map")}
      icon={<TravelExploreIcon />}
    />
  );

  return (
    <ControlBarItem
      label={datasetSelectLabel}
      control={datasetSelect}
      actions={locateDatasetButton}
    />
  );
}
