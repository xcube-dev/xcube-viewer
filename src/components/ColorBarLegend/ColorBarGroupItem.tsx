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

import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

const colorBarGroupItemStyle = (theme: Theme) => ({
  marginTop: theme.spacing(COLOR_BAR_ITEM_BOX_MARGIN),
  width: 240,
  height: 20,
  borderWidth: 1,
  borderStyle: "solid",
});

const useStyles = makeStyles((theme: Theme) => ({
  colorBarGroupItem: {
    ...colorBarGroupItemStyle(theme),
    borderColor: theme.palette.mode === "dark" ? "white" : "black",
  },
  colorBarGroupItemSelected: {
    ...colorBarGroupItemStyle(theme),
    borderColor: "orange",
  },
}));

interface ColorBarGroupItemProps {
  name: string;
  imageData: string;
  selected: boolean;
  onSelect: (colorBarName: string) => void;
}

export default function ColorBarGroupItem({
  name,
  imageData,
  selected,
  onSelect,
}: ColorBarGroupItemProps) {
  const classes = useStyles();

  const handleSelect = () => {
    onSelect(name);
  };

  return (
    <Box
      className={
        selected ? classes.colorBarGroupItemSelected : classes.colorBarGroupItem
      }
    >
      <Tooltip arrow title={name} placement="left">
        <img
          src={`data:image/png;base64,${imageData}`}
          alt={"Color Bar"}
          width={"100%"}
          height={"100%"}
          onClick={handleSelect}
        />
      </Tooltip>
    </Box>
  );
}
