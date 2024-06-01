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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";

const styles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 6,
    gap: 2,
  },
  action: {
    m: 1,
    position: "relative",
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-12px",
    marginLeft: "-12px",
  },
});

interface LastStatisticsRowProps extends WithLocale {
  hasStatistics: boolean;
  canAddStatistics: boolean;
  isLoading: boolean;
  addStatistics: () => void;
}

export default function LastStatisticsRow({
  hasStatistics,
  canAddStatistics,
  isLoading,
  addStatistics,
}: LastStatisticsRowProps) {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.action}>
        <Button disabled={!canAddStatistics} onClick={addStatistics}>
          {i18n.get("Add Statistics")}
        </Button>
        {isLoading && <CircularProgress size={24} sx={styles.progress} />}
      </Box>
      {!hasStatistics && (
        <Typography fontSize="smaller">
          {i18n.get(
            "No statistics have been obtained yet. Select a variable and a place first.",
          )}
        </Typography>
      )}
    </Box>
  );
}
