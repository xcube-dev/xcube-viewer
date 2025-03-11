/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { makeStyles } from "@/util/styles";

export const commonSx = makeStyles({
  accordion: {
    border: "none",
    background: "none",
  },
  accordionSummary: {
    padding: "0 4px",
  },
  accordionDetails: {
    padding: "0 4px",
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  cardHeader: {
    padding: 0,
  },
  cardTitle: {
    display: "flex",
    gap: 1,
    fontSize: "1rem",
  },
  cardContent: {
    padding: "4px 0",
  },
  table: { borderRadius: 0 },
  media: {
    maxHeight: 200,
  },
  code: {
    fontFamily: "Monospace",
  },
  toggleButton: {},
  htmlContent: (theme) => ({
    background: theme.palette.mode === "dark" ? "#383838" : "#e0e0e0",
    padding: 1,
    fontFamily: "Roboto",
    fontSize: "0.75rem",
  }),
});
