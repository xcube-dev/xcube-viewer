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

import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";

import { ColorBar, ColorBars, UserColorBar } from "@/model/colorBar";
import ColorBarStyleEditor from "@/components/ColorBarLegend/ColorBarStyleEditor";
import ColorBarSelect from "@/components/ColorBarLegend/ColorBarSelect";

const COLOR_BAR_BOX_MARGIN = 1;
const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

const useStyles = makeStyles((theme: Theme) => ({
  colorBarBox: {
    marginTop: theme.spacing(
      COLOR_BAR_BOX_MARGIN - 2 * COLOR_BAR_ITEM_BOX_MARGIN,
    ),
    marginLeft: theme.spacing(COLOR_BAR_BOX_MARGIN),
    marginRight: theme.spacing(COLOR_BAR_BOX_MARGIN),
    marginBottom: theme.spacing(COLOR_BAR_BOX_MARGIN),
  },
}));

interface ColorBarColorEditorProps {
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

export default function ColorBarColorEditor(props: ColorBarColorEditorProps) {
  const classes = useStyles();
  const { colorBars, userColorBars, updateUserColorBars, ...baseProps } = props;
  return (
    <Box className={classes.colorBarBox}>
      <ColorBarStyleEditor {...baseProps} />
      <ColorBarSelect
        {...baseProps}
        colorBars={colorBars}
        userColorBars={userColorBars}
        updateUserColorBars={updateUserColorBars}
      />
    </Box>
  );
}
