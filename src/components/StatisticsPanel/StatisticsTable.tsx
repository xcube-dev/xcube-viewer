/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
