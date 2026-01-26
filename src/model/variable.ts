/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type VolumeRenderMode } from "@/states/controlState";
import { type JsonPrimitive } from "@/util/json";

export type ColorBarNorm = "lin" | "log";

export interface Variable {
  id: string;
  name: string;
  dims: string[];
  shape: number[];
  dtype: string;
  units: string;
  title: string;
  description?: string;
  expression?: string; // user-defined variables only
  timeChunkSize: number | null;
  // The following are new since xcube 0.11
  tileLevelMin?: number;
  tileLevelMax?: number;
  // colorBarName may be prefixed by "_alpha" and/or "_r" (reversed)
  colorBarName: string;
  colorBarMin: number;
  colorBarMax: number;
  colorBarNorm?: ColorBarNorm;
  opacity?: number;
  volumeRenderMode?: VolumeRenderMode;
  volumeIsoThreshold?: number;
  htmlRepr?: string;
  attrs: Record<string, JsonPrimitive | JsonPrimitive[]>;
}
