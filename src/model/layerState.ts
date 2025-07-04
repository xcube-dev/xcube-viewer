/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export interface LayerState {
  id: string;
  type?: string;
  title: string;
  subTitle?: string;
  disabled?: boolean;
  visible?: boolean;
  pinned?: boolean;
  exclusive?: boolean;
}
