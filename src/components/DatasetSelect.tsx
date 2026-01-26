/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ReactElement, useMemo } from "react";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import PushPinIcon from "@mui/icons-material/PushPin";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import i18n from "@/i18n";
import type { Dataset } from "@/model/dataset";
import { WithLocale } from "@/util/lang";
import type { LayerVisibilities } from "@/states/controlState";
import ToolButton from "@/components/ToolButton";
import { commonStyles } from "@/components/common-styles";
import ControlBarItem from "./ControlBarItem";

interface DatasetSelectProps extends WithLocale {
  selectedDataset: Dataset | null;
  selectedDataset2Id: string | null;
  datasets: Dataset[];
  selectDataset: (
    datasetId: string | null,
    datasets: Dataset[],
    showInMap: boolean,
  ) => void;
  layerVisibilities: LayerVisibilities;
  toggleDatasetRgbLayer: (visible: boolean) => void;
  locateSelectedDataset: () => void;
}

export default function DatasetSelect({
  selectedDataset,
  selectedDataset2Id,
  datasets,
  selectDataset,
  layerVisibilities,
  toggleDatasetRgbLayer,
  locateSelectedDataset,
}: DatasetSelectProps) {
  const sortedDatasets = useMemo(() => {
    return datasets.sort((dataset1: Dataset, dataset2: Dataset) => {
      const groupOrder1 = dataset1.groupOrder ?? Infinity;
      const groupOrder2 = dataset2.groupOrder ?? Infinity;

      if (groupOrder1 !== groupOrder2) {
        return groupOrder1 - groupOrder2;
      }

      const groupTitle1 = dataset1.groupTitle || "zzz";
      const groupTitle2 = dataset2.groupTitle || "zzz";
      const delta = groupTitle1.localeCompare(groupTitle2);
      if (delta !== 0) {
        return delta;
      }
      const sortValue1 = dataset1.sortValue;
      const sortValue2 = dataset2.sortValue;

      // Handles when both sortValue are available
      if (sortValue1 !== undefined && sortValue2 !== undefined) {
        return sortValue1 - sortValue2;
      }

      // Handles when no sortValue is available
      if (sortValue1 === undefined && sortValue2 === undefined) {
        return dataset1.title.localeCompare(dataset2.title);
      }

      // Handles when only one sortValue is available
      return sortValue1 !== undefined ? -1 : 1;
    });
  }, [datasets]);

  const hasGroups = sortedDatasets.length > 0 && !!sortedDatasets[0].groupTitle;

  const handleDatasetChange = (event: SelectChangeEvent) => {
    const datasetId = event.target.value || null;
    selectDataset(datasetId, datasets, true);
  };

  const selectedDatasetId = selectedDataset ? selectedDataset.id : "";
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
      const groupDescription = dataset.groupDescription;
      if (groupTitle !== lastGroupTitle) {
        const content = (
          <Divider key={groupTitle}>
            <Typography fontSize="small" color="text.secondary">
              {groupTitle}
            </Typography>
          </Divider>
        );
        items.push(
          groupDescription ? (
            <Tooltip arrow title={groupDescription}>
              {content}
            </Tooltip>
          ) : (
            content
          ),
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
        <ListItemText>{getDatasetLabel(dataset)} </ListItemText>
        {dataset.id === selectedDataset2Id && (
          <PushPinIcon fontSize="small" color="secondary" />
        )}
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
      renderValue={() =>
        getDatasetLabel(datasets.find((d) => d.id === selectedDatasetId))
      }
    >
      {items}
    </Select>
  );

  const rgbVisible =
    layerVisibilities.datasetRgb && !layerVisibilities.datasetVariable;

  return (
    <ControlBarItem
      label={datasetSelectLabel}
      control={datasetSelect}
      actions={
        <>
          {selectedDataset?.rgbSchema && (
            <ToolButton
              onClick={() => toggleDatasetRgbLayer(!rgbVisible)}
              tooltipText={i18n.get(
                "Switch between dataset RGB layer and variable layer",
              )}
              sx={{
                ...commonStyles.toggleButton,
                width: "26.42px",
                height: "26.42px",
                marginLeft: 0.4,
              }}
              icon={<Typography fontSize={9}>RGB</Typography>}
              toggle
              value="rgb"
              selected={rgbVisible}
            />
          )}
          <ToolButton
            onClick={locateSelectedDataset}
            tooltipText={i18n.get("Locate dataset in map")}
            icon={<TravelExploreIcon />}
          />
        </>
      }
      sx={{ marginLeft: 0 }}
    />
  );
}

function getDatasetLabel(dataset: Dataset | undefined) {
  if (!dataset) {
    return "?";
  }
  return dataset.title || dataset.id;
}
