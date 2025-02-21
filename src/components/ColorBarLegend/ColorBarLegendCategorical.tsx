/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
