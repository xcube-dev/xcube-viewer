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

import {
  ColorBar,
  ColorBars,
  formatColorBar,
  USER_COLOR_BAR_GROUP_TITLE,
  UserColorBar,
} from "@/model/colorBar";
import ColorBarGroupComponent from "./ColorBarGroupComponent";
import UserColorBarGroup from "./UserColorBarGroup";

interface ColorBarSelectProps {
  variableColorBarMinMax: [number, number];
  variableColorBarName: string;
  variableColorBar: ColorBar;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarMinMax: [number, number],
    colorBarName: string,
    opacity: number,
  ) => void;
  colorBars: ColorBars;
  userColorBars: UserColorBar[];
  updateUserColorBars: (userColorBars: UserColorBar[]) => void;
}

export default function ColorBarSelect({
  variableColorBarMinMax,
  variableColorBarName,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  colorBars,
  userColorBars,
  updateUserColorBars,
}: ColorBarSelectProps) {
  const handleSelectColorBar = (baseName: string) => {
    variableColorBarName = formatColorBar({ ...variableColorBar, baseName });
    updateVariableColorBar(
      variableColorBarMinMax,
      variableColorBarName,
      variableOpacity,
    );
  };

  return (
    <>
      {colorBars.groups.map((colorBarGroup) =>
        colorBarGroup.title === USER_COLOR_BAR_GROUP_TITLE ? (
          <UserColorBarGroup
            key={colorBarGroup.title}
            colorBarGroup={colorBarGroup}
            selectedColorBarName={variableColorBar.baseName}
            onSelectColorBar={handleSelectColorBar}
            userColorBars={userColorBars}
            updateUserColorBars={updateUserColorBars}
          />
        ) : (
          <ColorBarGroupComponent
            key={colorBarGroup.title}
            colorBarGroup={colorBarGroup}
            selectedColorBarName={variableColorBar.baseName}
            onSelectColorBar={handleSelectColorBar}
            images={colorBars.images}
          />
        ),
      )}
    </>
  );
}
