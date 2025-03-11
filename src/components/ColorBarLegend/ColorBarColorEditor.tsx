/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme } from "@mui/system";
import Box from "@mui/material/Box";

import { ColorBar, ColorBars } from "@/model/colorBar";
import { UserColorBar } from "@/model/userColorBar";
import { ColorBarNorm } from "@/model/variable";
import ColorBarStyleEditor from "./ColorBarStyleEditor";
import ColorBarSelect from "./ColorBarSelect";
import { COLOR_BAR_ITEM_GAP, COLOR_BAR_BOX_MARGIN } from "./constants";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  colorBarBox: (theme: Theme) => ({
    marginTop: theme.spacing(COLOR_BAR_BOX_MARGIN - 2 * COLOR_BAR_ITEM_GAP),
    marginLeft: theme.spacing(COLOR_BAR_BOX_MARGIN),
    marginRight: theme.spacing(COLOR_BAR_BOX_MARGIN),
    marginBottom: theme.spacing(COLOR_BAR_BOX_MARGIN),
  }),
});

interface ColorBarColorEditorProps {
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

export default function ColorBarColorEditor(props: ColorBarColorEditorProps) {
  const {
    colorBars,
    userColorBars,
    addUserColorBar,
    removeUserColorBar,
    updateUserColorBar,
    updateUserColorBars,
    ...baseProps
  } = props;
  return (
    <Box sx={styles.colorBarBox}>
      <ColorBarStyleEditor {...baseProps} />
      <ColorBarSelect
        {...baseProps}
        colorBars={colorBars}
        userColorBars={userColorBars}
        addUserColorBar={addUserColorBar}
        removeUserColorBar={removeUserColorBar}
        updateUserColorBar={updateUserColorBar}
        updateUserColorBars={updateUserColorBars}
      />
    </Box>
  );
}
