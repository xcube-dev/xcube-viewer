/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type CSSProperties } from "react";

export const commonSx: Record<string, CSSProperties> = {
  card: {
    maxWidth: "100%",
    marginRight: 1,
  },
  cardHeader: {
    padding: 0,
  },
  cardContent: {
    padding: "4px 0",
    width: "100%",
  },
  info: {
    marginRight: 1,
  },
  close: {
    marginLeft: "auto",
  },
  table: {},
  media: {
    height: 200,
  },
  code: {
    fontFamily: "Monospace",
  },
  toggleButton: {
    //width: "12px",
  },
};
