/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { MapElement } from "../Map";

interface LayersProps {
  children: MapElement[];
}

export function Layers(props: LayersProps) {
  return <React.Fragment>{props.children}</React.Fragment>;
}
