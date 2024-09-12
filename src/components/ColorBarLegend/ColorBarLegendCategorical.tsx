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

import Box from "@mui/material/Box";

import { CssColorRecord } from "@/model/colorBar";
import { COLOR_BAR_ITEM_WIDTH } from "@/components/ColorBarLegend/constants";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: {
    width: COLOR_BAR_ITEM_WIDTH,
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemLabelBox: {
    paddingLeft: 1,
    fontSize: "small",
  },
  itemColorBox: (theme) => ({
    width: "48px",
    height: "16px",
    borderStyle: "solid",
    borderColor: theme.palette.mode === "dark" ? "lightgray" : "darkgray",
    borderWidth: 1,
  }),
});

export interface ColorBarLegendCategoricalProps {
  categories?: CssColorRecord[];
  onOpenColorBarEditor: () => void;
}

export default function ColorBarLegendCategorical({
  categories,
  onOpenColorBarEditor,
}: ColorBarLegendCategoricalProps) {
  if (!categories || categories.length === 0) {
    return null;
  }
  return (
    <Box sx={styles.container}>
      {categories.map((category, index) => (
        <Box
          key={index}
          onClick={onOpenColorBarEditor}
          sx={styles.itemContainer}
        >
          <Box
            sx={styles.itemColorBox}
            style={{ backgroundColor: category.color }}
          />
          <Box component="span" sx={styles.itemLabelBox}>
            {`${category.label || `Category ${index + 1}`} (${category.value})`}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
