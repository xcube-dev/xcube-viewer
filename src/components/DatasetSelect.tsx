/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
import { ReactElement, useMemo } from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

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
  const sortedDatasets = useMemo(() => {
    return datasets.sort((dataset1: Dataset, dataset2: Dataset) => {
      const groupTitle1 = dataset1.groupTitle || "zzz";
      const groupTitle2 = dataset2.groupTitle || "zzz";
      const delta = groupTitle1.localeCompare(groupTitle2);
      if (delta !== 0) {
        return delta;
      }
      return dataset1.title.localeCompare(dataset2.title);
    });
  }, [datasets]);

  const hasGroups = sortedDatasets.length > 0 && !!sortedDatasets[0].groupTitle;

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

  const items: ReactElement[] = [];
  let lastGroupTitle: string | undefined;
  sortedDatasets.forEach((dataset) => {
    if (hasGroups) {
      const groupTitle = dataset.groupTitle || i18n.get("Others");
      if (groupTitle !== lastGroupTitle) {
        items.push(
          <Divider key={groupTitle}>
            <Typography fontSize="small" color="text.secondary">
              {groupTitle}
            </Typography>
          </Divider>,
        );
      }
      lastGroupTitle = groupTitle;
    }

    items.push(
      <MenuItem
        key={dataset.id}
        value={dataset.id}
        selected={dataset.id === selectedDatasetId}
      >
        {dataset.title}
      </MenuItem>,
    );
  });

  const datasetSelect = (
    <Select
      variant="standard"
      value={selectedDatasetId}
      onChange={handleDatasetChange}
      input={<Input name="dataset" id="dataset-select" />}
      displayEmpty
      name="dataset"
    >
      {items}
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
      sx={{ marginLeft: 0 }}
    />
  );
}
