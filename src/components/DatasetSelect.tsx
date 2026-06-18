/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import PushPinIcon from "@mui/icons-material/PushPin";
import TextField from "@mui/material/TextField";
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
    return [...(datasets || [])].sort(
      (dataset1: Dataset, dataset2: Dataset) => {
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
      },
    );
  }, [datasets]);

  const hasGroups = sortedDatasets.some((dataset) => !!dataset.groupTitle);

  const getGroupDescription = (groupTitle: string) =>
    sortedDatasets.find(
      (dataset) => getDatasetGroupTitle(dataset) === groupTitle,
    )?.groupDescription;

  const selectedDatasetId = selectedDataset ? selectedDataset.id : "";

  const datasetSelectLabel = (
    <InputLabel shrink htmlFor="dataset-select">
      {i18n.get("Dataset")}
    </InputLabel>
  );

  const datasetSelect = (
    <Autocomplete
      id="dataset-select"
      options={sortedDatasets}
      value={
        sortedDatasets.find((dataset) => dataset.id === selectedDatasetId) ??
        null
      }
      onChange={(_, dataset) => {
        selectDataset(dataset?.id ?? null, datasets || [], true);
      }}
      getOptionLabel={getDatasetLabel}
      groupBy={hasGroups ? getDatasetGroupTitle : undefined}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disableClearable={!!selectedDataset}
      autoHighlight
      blurOnSelect
      sx={{
        display: "inline-flex",
        minWidth: 240,
        mt: 2,
        verticalAlign: "bottom",
      }}
      renderGroup={(params) => {
        const groupDescription = getGroupDescription(params.group);
        const groupTitle = (
          <Divider sx={{ mx: 1, my: 0.5 }}>
            <Typography fontSize="small" color="text.secondary">
              {params.group}
            </Typography>
          </Divider>
        );

        return (
          <li key={params.key}>
            {groupDescription ? (
              <Tooltip arrow title={groupDescription}>
                {groupTitle}
              </Tooltip>
            ) : (
              groupTitle
            )}
            <ul style={{ margin: 0, padding: 0 }}>{params.children}</ul>
          </li>
        );
      }}
      renderOption={({ key, ...props }, dataset) => (
        <li key={key} {...props}>
          <ListItemText>{getDatasetLabel(dataset)}</ListItemText>
          {dataset.id === selectedDataset2Id && (
            <PushPinIcon fontSize="small" color="secondary" />
          )}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          inputProps={{
            ...params.inputProps,
            name: "dataset",
          }}
        />
      )}
    />
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
function getDatasetGroupTitle(dataset: Dataset) {
  return dataset.groupTitle || i18n.get("Others");
}
