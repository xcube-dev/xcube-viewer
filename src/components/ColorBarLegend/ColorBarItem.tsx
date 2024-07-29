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
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@/util/styles";

import { COLOR_BAR_ITEM_GAP, COLOR_BAR_ITEM_WIDTH } from "./constants";

const colorBarItemStyle = (theme: Theme) => ({
  marginTop: theme.spacing(COLOR_BAR_ITEM_GAP),
  height: 20,
  borderWidth: 1,
  borderStyle: "solid",
  cursor: "pointer",
});

const styles = makeStyles({
  colorBarItem: (theme: Theme) => ({
    ...colorBarItemStyle(theme),
    borderColor: theme.palette.mode === "dark" ? "lightgray" : "darkgray",
  }),
  colorBarItemSelected: (theme: Theme) => ({
    ...colorBarItemStyle(theme),
    borderColor: "blue",
  }),
});

interface ColorBarItemProps {
  imageData?: string;
  selected?: boolean;
  onSelect?: () => void;
  width?: number | string;
  title?: string;
}

export default function ColorBarItem({
  imageData,
  selected,
  onSelect,
  width,
  title,
}: ColorBarItemProps) {
  let image = (
    <img
      src={imageData ? `data:image/png;base64,${imageData}` : undefined}
      alt={imageData ? "color bar" : "error"}
      width={"100%"}
      height={"100%"}
      onClick={onSelect}
    />
  );

  if (title) {
    image = (
      <Tooltip arrow title={title} placement="left">
        {image}
      </Tooltip>
    );
  }

  return (
    <Box
      width={width || COLOR_BAR_ITEM_WIDTH}
      sx={selected ? styles.colorBarItemSelected : styles.colorBarItem}
    >
      {image}
    </Box>
  );
}
