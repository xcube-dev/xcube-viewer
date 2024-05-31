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
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableRows from "@mui/icons-material/TableRows";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { StatisticsRecord } from "@/model/statistics";

const styles = makeStyles({
  container: {
    padding: 1,
  },
});

interface StatisticsRowProps extends WithLocale {
  statisticsRecord: StatisticsRecord;
}

export default function StatisticsRow({
  statisticsRecord,
}: StatisticsRowProps) {
  return (
    <Box sx={styles.container}>
      <Typography fontSize="smaller">
        {`${statisticsRecord.source.datasetTitle} / ${statisticsRecord.source.variableName}`}
      </Typography>
      <Table>
        <TableRows>
          <TableRow>
            <TableCell>{i18n.get("Minimum")}</TableCell>
            <TableCell>{statisticsRecord.minimum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{i18n.get("Maximum")}</TableCell>
            <TableCell>{statisticsRecord.minimum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{i18n.get("Mean")}</TableCell>
            <TableCell>{statisticsRecord.mean}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{i18n.get("Deviation")}</TableCell>
            <TableCell>{statisticsRecord.standardDev}</TableCell>
          </TableRow>
        </TableRows>
      </Table>
    </Box>
  );
}
