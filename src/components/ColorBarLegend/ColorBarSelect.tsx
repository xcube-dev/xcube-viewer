/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
