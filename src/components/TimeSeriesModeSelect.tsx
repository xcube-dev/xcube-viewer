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

import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Switch from "@mui/material/Switch";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";

// TODO (forman): this component doesn't seem to be in use - remove!

const styles = (_theme: Theme) => createStyles({});

interface TimeSeriesModeSelectProps
  extends WithStyles<typeof styles>,
    WithLocale {
  timeSeriesUpdateMode: "add" | "replace";
  selectTimeSeriesUpdateMode: (timeSeriesUpdateMode: "add" | "replace") => void;
}

const _TimeSeriesModeSelect: React.FC<TimeSeriesModeSelectProps> = ({
  timeSeriesUpdateMode,
  selectTimeSeriesUpdateMode,
}) => {
  const handleTimeSeriesUpdateModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    selectTimeSeriesUpdateMode(event.target.checked ? "add" : "replace");
  };

  return (
    <FormControlLabel
      label={i18n.get("Multi")}
      control={
        <Switch
          checked={timeSeriesUpdateMode === "add"}
          onChange={handleTimeSeriesUpdateModeChange}
        />
      }
    />
  );
};

const TimeSeriesModeSelect = withStyles(styles)(_TimeSeriesModeSelect);
export default TimeSeriesModeSelect;
