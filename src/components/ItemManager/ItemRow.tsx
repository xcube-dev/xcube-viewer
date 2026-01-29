/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { RefObject, ReactNode } from "react";
import Box from "@mui/material/Box";

import type { WithLocale } from "@/util/lang";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: {
    padding: 0,
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 0.5,
  },
  actions: {
    display: "flex",
    gap: 0.1,
  },
  body: {
    display: "flex",
  },
});

interface ItemRowProps extends WithLocale {
  title: ReactNode;
  actions: ReactNode;
  body?: ReactNode;
  containerRef?: RefObject<HTMLDivElement>;
}

export default function ItemRow({
  title,
  actions,
  body,
  containerRef,
}: ItemRowProps) {
  return (
    <Box sx={styles.container} ref={containerRef}>
      <Box sx={styles.header}>
        {title}
        <Box sx={styles.actions}>{actions}</Box>
      </Box>
      {body && <Box sx={styles.body}>{body}</Box>}
    </Box>
  );
}
