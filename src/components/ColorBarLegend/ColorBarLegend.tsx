/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, MouseEvent, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { makeStyles } from "@/util/styles";
import type { ColorBar, ColorBars } from "@/model/colorBar";
import type { UserColorBar } from "@/model/userColorBar";
import type { ColorBarNorm } from "@/model/variable";
import { COLOR_BAR_ITEM_WIDTH } from "./constants";
import { getBorderStyle } from "./style";
import ColorBarLegendCategorical from "./ColorBarLegendCategorical";
import ColorBarLegendScalable from "./ColorBarLegendScalable";
import ColorBarColorEditor from "./ColorBarColorEditor";

const styles = makeStyles({
  container: (theme) => ({
    position: "absolute",
    zIndex: 1000,
    top: 10,
    border: getBorderStyle(theme),
    borderRadius: "5px",
    backgroundColor: theme.palette.background.default,
    maxWidth: `${COLOR_BAR_ITEM_WIDTH + 20}px`,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
  }),
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: 0.5,
  },
  title: {
    fontSize: "0.8rem",
    fontWeight: "normal",
    wordBreak: "break-word",
    wordWrap: "break-word",
  },
  subTitle: {
    fontSize: "0.7rem",
    fontWeight: "lighter",
    wordBreak: "break-word",
    wordWrap: "break-word",
  },
});

interface ColorBarLegendProps {
  datasetTitle: string | null;
  variableName: string | null;
  variableTitle: string | null;
  variableUnits: string;
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
  onOpenColorBarEditor: (event: MouseEvent<HTMLCanvasElement>) => void;
  storeSettings: () => void;
  style?: CSSProperties;
}

export default function ColorBarLegend(
  props: Omit<ColorBarLegendProps, "onOpenColorBarEditor">,
) {
  const {
    datasetTitle,
    variableName,
    variableTitle,
    variableUnits,
    variableColorBar,
    style,
  } = props;

  const colorBarSelectAnchorRef = useRef<HTMLDivElement | null>(null);
  const [colorBarSelectAnchorEl, setColorBarSelectAnchorEl] =
    useState<HTMLDivElement | null>(null);

  const handleOpenColorBarSelect = () => {
    setColorBarSelectAnchorEl(colorBarSelectAnchorRef.current);
  };

  const handleCloseColorBarSelect = () => {
    setColorBarSelectAnchorEl(null);
  };

  if (!variableName) {
    return null;
  }

  const effectiveVariableTitle =
    variableColorBar.type === "categorical" ||
    !variableUnits ||
    variableUnits === "1" ||
    variableUnits === "-"
      ? variableTitle || variableName
      : `${variableTitle || variableName} (${variableUnits})`;

  return (
    <Box sx={styles.container} style={style} ref={colorBarSelectAnchorRef}>
      <Box sx={styles.header}>
        <Typography sx={styles.title} variant="subtitle1" color="textPrimary">
          {effectiveVariableTitle}
        </Typography>
        {datasetTitle && (
          <Typography
            sx={styles.subTitle}
            variant="subtitle2"
            color="textSecondary"
          >
            {datasetTitle}
          </Typography>
        )}
      </Box>
      {variableColorBar.type === "categorical" ? (
        <ColorBarLegendCategorical
          categories={variableColorBar.colorRecords}
          onOpenColorBarEditor={handleOpenColorBarSelect}
          {...props}
        />
      ) : (
        <ColorBarLegendScalable
          onOpenColorBarEditor={handleOpenColorBarSelect}
          {...props}
        />
      )}
      <Popover
        anchorEl={colorBarSelectAnchorEl}
        open={Boolean(colorBarSelectAnchorEl)}
        onClose={handleCloseColorBarSelect}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <ColorBarColorEditor {...props} />
      </Popover>
    </Box>
  );
}
