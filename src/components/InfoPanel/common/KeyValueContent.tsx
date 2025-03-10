/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { makeStyles } from "@/util/styles";
import { commonSx } from "./styles";

const styles = makeStyles({
  keyValueTableContainer: (theme) => ({
    background: theme.palette.mode === "dark" ? "#181818" : "#f0f0f0",
  }),
});

export type KeyValue = [string, React.ReactNode];

interface KeyValueContentProps {
  data: KeyValue[];
}

const KeyValueContent: React.FC<KeyValueContentProps> = ({ data }) => {
  return (
    <TableContainer sx={styles.keyValueTableContainer}>
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

export default KeyValueContent;
