/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ComponentType } from "react";
import type { Plugin, ComponentProps } from "chartlets";

import Markdown from "@/components/Markdown";

export default function xc_viewer(): Plugin {
  return {
    // TODO: the following type cast is not acceptable, but there is
    //  no reason why component props must implement ComponentProps
    //  from chartlets. This need to be fixed in chartlets!
    components: [["Markdown", Markdown as ComponentType<ComponentProps>]],
  };
}
