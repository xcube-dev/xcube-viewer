/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { PlaceInfo } from "@/model/place";
import StatisticsRow from "./StatisticsRow";
import { DimensionValues } from "@/states/controlState";

const styles = makeStyles({
  progress: {
    color: "primary",
  },
});

interface StatisticsFirstRowProps extends WithLocale {
  selectedDataset: Dataset | null;
  selectedVariable: Variable | null;
  selectedTime: string | null;
  selectedDimensionValues: DimensionValues;
  selectedPlaceInfo: PlaceInfo | null;
  canAddStatistics: boolean;
  addStatistics: () => void;
  statisticsLoading: boolean;
}

export default function StatisticsFirstRow({
  selectedDataset,
  selectedVariable,
  selectedTime,
  selectedDimensionValues,
  selectedPlaceInfo,
  canAddStatistics,
  addStatistics,
  statisticsLoading,
}: StatisticsFirstRowProps) {
  return (
    <StatisticsRow
      dataset={selectedDataset}
      variable={selectedVariable}
      time={selectedTime}
      dimensionValues={selectedDimensionValues}
      placeInfo={selectedPlaceInfo}
      actions={
        statisticsLoading ? (
          <CircularProgress size={20} sx={styles.progress} />
        ) : (
          <IconButton
            size="small"
            disabled={!canAddStatistics}
            onClick={addStatistics}
            color={"primary"}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )
      }
    />
  );
}
