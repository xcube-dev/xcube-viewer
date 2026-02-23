/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { SxProps, Theme } from "@mui/system";
import { CSSProperties } from "react";

type RawStyles<S, T extends Theme = Theme> = Record<keyof S, SxProps<T>>;
type Styles<S extends object, T extends Theme = Theme> = {
  [P in keyof S]: SxProps<T>;
};

/**
 * Convert given styles object into its type-safe version
 * where `S` the type of the "raw" styles
 * and `T` is the MUI theme type.
 * @param rawStyles Object that maps a property key into an `SxProps` value.
 */
export function makeStyles<S extends object, T extends Theme = Theme>(
  rawStyles: RawStyles<S, T>,
): Styles<S, T> {
  return rawStyles;
}

type CssStyles<S extends object> = {
  [P in keyof S]: CSSProperties;
};

export function makeCssStyles<S extends object>(
  rawStyles: CssStyles<S>,
): CssStyles<S> {
  return rawStyles;
}
