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
  addStatistics: () => void;
  statisticsLoading: boolean;
}

export default function StatisticsFirstRow({
  selectedDataset,
  selectedVariable,
  selectedTime,
  selectedPlaceInfo,
  addStatistics,
  statisticsLoading,
}: StatisticsFirstRowProps) {
  const canAdd = !!(
    selectedDataset &&
    selectedVariable &&
    selectedTime &&
    selectedPlaceInfo
  );
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
            disabled={!canAdd}
            onClick={addStatistics}
            color={"primary"}
          >
            <AddCircleOutlineIcon fontSize="inherit" />
          </IconButton>
        )
      }
    />
  );
}
