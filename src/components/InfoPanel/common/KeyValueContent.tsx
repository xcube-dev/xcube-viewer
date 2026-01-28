/*
 * Copyright (c) 2019-2026 by xcube team and contributors
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
import { getRenderedMetadataValue } from "./utils";

const styles = makeStyles({
  keyValueTableContainer: (theme) => ({
    background: theme.palette.mode === "dark" ? "#181818" : "#f0f0f0",
  }),
});

export type KeyValue = [string, React.ReactNode];

interface KeyValueContentProps {
  data: KeyValue[];
  types?: boolean;
}

const KeyValueContent: React.FC<KeyValueContentProps> = ({ data, types }) => {
  return (
    <TableContainer sx={styles.keyValueTableContainer}>
      <Table sx={commonSx.table} size="small">
        <TableBody>
          {data.map((kv, index) => {
            const [key, value] = kv;
            const renderedValue = getRenderedMetadataValue(value);
            const isLink =
              typeof value === "string" && renderedValue.startsWith("https://");
            return (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                {types && (
                  <TableCell>
                    {Array.isArray(value) ? "array" : typeof value}
                  </TableCell>
                )}
                <TableCell align="right">
                  {isLink ? (
                    <Link href={renderedValue} target="_blank" rel="noreferrer">
                      {renderedValue}
                    </Link>
                  ) : (
                    renderedValue
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KeyValueContent;
