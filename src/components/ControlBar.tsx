/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { PropsWithChildren } from "react";
import { styled, Theme } from "@mui/system";

const ControlBarForm = styled("form")(({ theme }: { theme: Theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.25),
  flexGrow: 0,
}));

type ControlBarProps = object;

export default function ControlBar({
  children,
}: PropsWithChildren<ControlBarProps>) {
  return <ControlBarForm autoComplete="off">{children}</ControlBarForm>;
}
