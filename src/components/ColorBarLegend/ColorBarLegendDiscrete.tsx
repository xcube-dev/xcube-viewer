/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";

import { CssColorRecord } from "@/model/colorBar";
import { COLOR_BAR_ITEM_WIDTH } from "@/components/ColorBarLegend/constants";
import { makeStyles } from "@/util/styles";
import { getLabelForValue } from "@/util/label";

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
    flexShrink: 0,
    height: "16px",
    borderStyle: "solid",
    borderColor: theme.palette.mode === "dark" ? "lightgray" : "darkgray",
    borderWidth: 1,
  }),
});

export interface ColorBarLegendDiscreteProps {
  categories?: CssColorRecord[];
  stepwise?: {
    minMax: [number, number];
  };
  onOpenColorBarEditor: () => void;
}

export default function ColorBarLegendDiscrete({
  categories,
  stepwise,
  onOpenColorBarEditor,
}: ColorBarLegendDiscreteProps) {
  if (!categories || categories.length === 0) {
    return null;
  }
  let entries = categories.map((category, index) => ({
    color: category.color,
    label: `${category.label || `Category ${index + 1}`} (${category.value})`,
  }));
  if (stepwise) {
    if (categories.length < 2) {
      return null;
    }
    const {
      minMax: [min, max],
    } = stepwise;
    const first = categories[0].value;
    const span = categories[categories.length - 1].value - first;
    const valueAt = (value: number) => {
      const t = (value - first) / span;
      if (t === 0) return min;
      if (t === 1) return max;
      return min + t * (max - min);
    };
    // The final record supplies the upper boundary, not another color.
    entries = categories.slice(0, -1).map((category, index) => {
      const bounds = [
        valueAt(category.value),
        valueAt(categories[index + 1].value),
      ]
        .sort((a, b) => a - b)
        .map((value) => getLabelForValue(value));
      const interval = bounds.join(" – ");
      return {
        color: category.color,
        label: category.label ? `${category.label} (${interval})` : interval,
      };
    });
  }
  return (
    <Box sx={styles.container}>
      {entries.map((category, index) => (
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
            {category.label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
