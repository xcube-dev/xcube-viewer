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
