/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
          name={name}
          imageData={images[name]}
          selected={name === selectedColorBarName}
          onSelect={onSelectColorBar}
        />
      ))}
    </>
  );
}
