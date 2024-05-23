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

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";
import ExpandIcon from "@mui/icons-material/Expand";
import FitScreenIcon from "@mui/icons-material/FitScreen";

import i18n from "@/i18n";
import {
  PlaceGroupTimeSeries,
  TimeSeries,
  TimeSeriesGroup,
} from "@/model/timeSeries";
import { WithLocale } from "@/util/lang";
import TimeSeriesAddButton from "./TimeSeriesAddButton";
import ValueRangeEditor from "./ValueRangeEditor";
import { makeStyles } from "@/util/styles";

type ValueRange = [number, number];

const styles = makeStyles({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "10px",
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: "1px",
  },
  responsiveContainer: {
    flexGrow: "1px",
  },
  actionButton: {
    zIndex: 1000,
    opacity: 0.8,
  },
  chartTitle: {
    fontSize: "inherit",
    fontWeight: "normal",
  },
});

interface TimeSeriesChartHeaderProps extends WithLocale {
  timeSeriesGroup: TimeSeriesGroup;
  removeTimeSeriesGroup: (timeSeriesGroupId: string) => void;
  placeGroupTimeSeries: PlaceGroupTimeSeries[];
  addPlaceGroupTimeSeries: (
    timeSeriesGroupId: string,
    timeSeries: TimeSeries,
  ) => void;
  resetZoom: () => void;
  loading: boolean;
  zoomed: boolean;
  zoomMode: boolean;
  setZoomMode: (zoomMode: boolean) => void;
  showTooltips: boolean;
  setShowTooltips: (showTooltips: boolean) => void;
  showBarChart: boolean;
  setShowBarChart: (barChart: boolean) => void;
  valueRange: ValueRange | undefined;
  setValueRange: (fixedValueRange: ValueRange | undefined) => void;
}

export default function TimeSeriesChartHeader({
  timeSeriesGroup,
  placeGroupTimeSeries,
  addPlaceGroupTimeSeries,
  removeTimeSeriesGroup,
  resetZoom,
  loading,
  zoomed,
  zoomMode,
  setZoomMode,
  showTooltips,
  setShowTooltips,
  showBarChart,
  setShowBarChart,
  valueRange,
  setValueRange,
}: TimeSeriesChartHeaderProps) {
  const valueRangeEl = useRef<HTMLButtonElement | null>(null);
  const [valueRangeEditorOpen, setValueRangeEditorOpen] = useState(false);
  const timeSeriesText = i18n.get("Time-Series");
  const unitsText = timeSeriesGroup.variableUnits || i18n.get("unknown units");
  const chartTitle = `${timeSeriesText} (${unitsText})`;

  const handleToggleValueRangeEditor = () => {
    setValueRangeEditorOpen(!valueRangeEditorOpen);
  };

  const handleValueRangeChange = (valueRange: ValueRange | undefined) => {
    setValueRangeEditorOpen(false);
    if (valueRange) {
      setValueRange(valueRange);
    }
  };

  return (
    <Box sx={styles.headerContainer}>
      <Typography sx={styles.chartTitle}>{chartTitle}</Typography>
      <Box sx={styles.actionsContainer}>
        {zoomed && (
          <Tooltip arrow title={i18n.get("Zoom to full range")}>
            <IconButton
              key={"zoomOutButton"}
              sx={styles.actionButton}
              onClick={resetZoom}
              size="small"
            >
              <FitScreenIcon fontSize={"inherit"} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip arrow title={i18n.get("Toggle zoom mode (or press CTRL key)")}>
          <ToggleButton
            value={"zoomMode"}
            selected={zoomMode}
            onClick={() => setZoomMode(!zoomMode)}
            size="small"
          >
            <AspectRatioIcon fontSize="inherit" />
          </ToggleButton>
        </Tooltip>
        <ValueRangeEditor
          anchorEl={valueRangeEditorOpen ? valueRangeEl.current : null}
          valueRange={valueRange}
          setValueRange={handleValueRangeChange}
        />
        <Tooltip arrow title={i18n.get("Enter fixed y-range")}>
          <ToggleButton
            ref={valueRangeEl}
            value={"valueRange"}
            selected={valueRangeEditorOpen}
            onClick={handleToggleValueRangeEditor}
            size="small"
          >
            <ExpandIcon fontSize="inherit" />
          </ToggleButton>
        </Tooltip>
        <Tooltip arrow title={i18n.get("Toggle showing info popup on hover")}>
          <ToggleButton
            value={"showTooltips"}
            selected={showTooltips}
            onClick={() => setShowTooltips(!showTooltips)}
            size="small"
          >
            <CommentIcon fontSize="inherit" />
          </ToggleButton>
        </Tooltip>
        <Tooltip
          arrow
          title={i18n.get("Toggle between showing a bar or line chart")}
        >
          <ToggleButton
            value={"showBarChart"}
            selected={showBarChart}
            onClick={() => setShowBarChart(!showBarChart)}
            size="small"
          >
            <BarChartIcon fontSize="inherit" />
          </ToggleButton>
        </Tooltip>
        <TimeSeriesAddButton
          sx={styles.actionButton}
          timeSeriesGroupId={timeSeriesGroup.id}
          placeGroupTimeSeries={placeGroupTimeSeries}
          addPlaceGroupTimeSeries={addPlaceGroupTimeSeries}
        />
        {loading ? (
          // Note, we show progress instead of the close button,
          // because we can not yet cancel loading time series.
          <CircularProgress
            size={24}
            sx={styles.actionButton}
            color={"secondary"}
          />
        ) : (
          <IconButton
            sx={styles.actionButton}
            aria-label="Close"
            onClick={() => removeTimeSeriesGroup(timeSeriesGroup.id)}
            size="small"
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
