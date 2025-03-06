/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { makeCssStyles } from "@/util/styles";

export const commonSx = makeCssStyles({
  accordion: {
    border: "none",
    background: "none",
  },
  accordionSummary: {
    padding: "0 4px",
  },
  accordionDetails: {
    padding: "0 4px",
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
  table: {},
  media: {
    maxHeight: 200,
  },
  code: {
    fontFamily: "Monospace",
  },
  toggleButton: {},
});
