/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { PlaceInfo } from "@/model/place";
import StatisticsRow from "./StatisticsRow";
import CircularProgress from "@mui/material/CircularProgress";

const styles = makeStyles({
  progress: {
    color: "primary",
  },
});

interface StatisticsFirstRowProps extends WithLocale {
  selectedDataset: Dataset | null;
  selectedVariable: Variable | null;
  selectedTime: string | null;
  selectedPlaceInfo: PlaceInfo | null;
  canAddStatistics: boolean;
  addStatistics: () => void;
  statisticsLoading: boolean;
}

export default function StatisticsFirstRow({
  selectedDataset,
  selectedVariable,
  selectedTime,
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
