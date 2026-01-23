/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ColorBarGroup } from "@/model/colorBar";
import ColorBarGroupHeader from "./ColorBarGroupHeader";
import ColorBarItem from "./ColorBarItem";

interface ColorBarGroupComponentProps {
  colorBarGroup: ColorBarGroup;
  selectedColorBarName: string | null;
  onSelectColorBar: (colorBarName: string) => void;
  images: Record<string, string>;
}

export default function ColorBarGroupComponent({
  colorBarGroup,
  selectedColorBarName,
  onSelectColorBar,
  images,
}: ColorBarGroupComponentProps) {
  return (
    <>
      <ColorBarGroupHeader
        title={colorBarGroup.title}
        description={colorBarGroup.description}
      />
      {colorBarGroup.names.map((name) => (
        <ColorBarItem
          key={name}
          title={name}
          imageData={images[name]}
          selected={name === selectedColorBarName}
          onSelect={() => onSelectColorBar(name)}
        />
      ))}
    </>
  );
}
