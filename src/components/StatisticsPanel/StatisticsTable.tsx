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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import {
  isNullStatistics,
  isPointStatistics,
  StatisticsRecord,
} from "@/model/statistics";
import { getLabelForValue } from "@/util/label";

// const styles = makeStyles({});

interface StatisticsTableProps extends WithLocale {
  statisticsRecord: StatisticsRecord;
}

export default function StatisticsTable({
  statisticsRecord,
}: StatisticsTableProps) {
  const statistics = statisticsRecord.statistics;
  return (
    <Table size={"small"}>
      <TableBody>
        {isNullStatistics(statistics) ? (
          <TableRow>
            <TableCell>{i18n.get("Value")}</TableCell>
            <TableCell align="right">NaN</TableCell>
          </TableRow>
        ) : isPointStatistics(statistics) ? (
          <TableRow>
            <TableCell>{i18n.get("Value")}</TableCell>
            <TableCell align="right">{format(statistics.mean)}</TableCell>
          </TableRow>
        ) : (
          <>
            <TableRow>
              <TableCell>{i18n.get("Count")}</TableCell>
              <TableCell align="right">{statistics.count}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{i18n.get("Minimum")}</TableCell>
              <TableCell align="right">{format(statistics.minimum)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{i18n.get("Maximum")}</TableCell>
              <TableCell align="right">{format(statistics.maximum)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{i18n.get("Mean")}</TableCell>
              <TableCell align="right">{format(statistics.mean)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{i18n.get("Deviation")}</TableCell>
              <TableCell align="right">
                {format(statistics.deviation)}
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
}

function format(x: number) {
  return getLabelForValue(x, 3);
}
