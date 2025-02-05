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

import React from "react";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { makeStyles } from "@/util/styles";
import { commonSx } from "./styles";

const styles = makeStyles({
  keyValueTableContainer: (theme) => ({
    background: theme.palette.divider,
  }),
});

export type KeyValue = [string, React.ReactNode];

interface KeyValueTableProps {
  data: KeyValue[];
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={styles.keyValueTableContainer}>
      <Table sx={commonSx.table} size="small">
        <TableBody>
          {data.map((kv, index) => {
            const [key, value] = kv;
            let renderedValue = value;
            // noinspection HttpUrlsUsage
            if (
              typeof value === "string" &&
              (value.startsWith("http://") || value.startsWith("https://"))
            ) {
              renderedValue = (
                <Link href={value} target="_blank" rel="noreferrer">
                  {value}
                </Link>
              );
            } else if (Array.isArray(value)) {
              renderedValue = "[" + value.map((v) => v + "").join(", ") + "]";
            }
            return (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                <TableCell align="right">{renderedValue}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KeyValueTable;
