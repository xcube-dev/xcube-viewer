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

import { ColorBar, ColorBars, formatColorBarName } from "@/model/colorBar";
import { USER_COLOR_BAR_GROUP_TITLE, UserColorBar } from "@/model/userColorBar";
import ColorBarGroupComponent from "./ColorBarGroupComponent";
import UserColorBarGroup from "./UserColorBarGroup";
import { ColorBarNorm } from "@/model/variable";

interface ColorBarSelectProps {
  variableColorBarName: string;
  variableColorBarMinMax: [number, number];
  variableColorBarNorm: ColorBarNorm;
  variableColorBar: ColorBar;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarName: string,
    colorBarMinMax: [number, number],
    colorBarNorm: ColorBarNorm,
    opacity: number,
  ) => void;
  colorBars: ColorBars;
  userColorBars: UserColorBar[];
  addUserColorBar: (userColorBarId: string) => void;
  removeUserColorBar: (userColorBarId: string) => void;
  updateUserColorBar: (userColorBar: UserColorBar) => void;
  updateUserColorBars: (userColorBars: UserColorBar[]) => void;
  storeSettings: () => void;
}

export default function ColorBarSelect({
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  colorBars,
  userColorBars,
  addUserColorBar,
  removeUserColorBar,
  updateUserColorBar,
  updateUserColorBars,
  storeSettings,
}: ColorBarSelectProps) {
  const handleSelectColorBar = (baseName: string) => {
    variableColorBarName = formatColorBarName({
      ...variableColorBar,
      baseName,
    });
    updateVariableColorBar(
      variableColorBarName,
      variableColorBarMinMax,
      variableColorBarNorm,
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
            addUserColorBar={addUserColorBar}
            removeUserColorBar={removeUserColorBar}
            updateUserColorBar={updateUserColorBar}
            updateUserColorBars={updateUserColorBars}
            storeSettings={storeSettings}
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
