/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import OpacityIcon from "@mui/icons-material/Opacity";

import i18n from "@/i18n";
import { ColorBar, formatColorBarName } from "@/model/colorBar";
import { ColorBarNorm } from "@/model/variable";
import { SxProps, Theme } from "@mui/system";

const styles: Record<string, SxProps<Theme>> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsBar: {
    display: "flex",
    gap: "1px",
  },
  toggleButton: {
    paddingTop: "2px",
    paddingBottom: "2px",
  },
  opacityContainer: {
    display: "flex",
    alignItems: "center",
  },
  opacityLabel: (theme) => ({
    color: theme.palette.text.secondary,
  }),
  opacitySlider: {
    flexGrow: "1px",
    marginLeft: "10px",
    marginRight: "10px",
  },
};

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
}

export default function ColorBarStyleEditor({
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
}: ColorBarSelectProps) {
  const handleColorBarAlpha = () => {
    const isAlpha = !variableColorBar.isAlpha;
    variableColorBarName = formatColorBarName({ ...variableColorBar, isAlpha });
    updateVariableColorBar(
      variableColorBarName,
      variableColorBarMinMax,
      variableColorBarNorm,
      variableOpacity,
    );
  };

  const handleColorBarReversed = () => {
    const isReversed = !variableColorBar.isReversed;
    variableColorBarName = formatColorBarName({
      ...variableColorBar,
      isReversed,
    });
    updateVariableColorBar(
      variableColorBarName,
      variableColorBarMinMax,
      variableColorBarNorm,
      variableOpacity,
    );
  };

  const handleVariableOpacity = (_event: Event, value: number | number[]) => {
    updateVariableColorBar(
      variableColorBarName,
      variableColorBarMinMax,
      variableColorBarNorm,
      value as number,
    );
  };

  return (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.settingsBar}>
          <Tooltip arrow title={i18n.get("Hide small values")}>
            <ToggleButton
              value={"alpha"}
              selected={variableColorBar.isAlpha}
              onChange={handleColorBarAlpha}
              size="small"
            >
              <OpacityIcon fontSize="inherit" />
            </ToggleButton>
          </Tooltip>
          <Tooltip arrow title={i18n.get("Reverse")}>
            <ToggleButton
              value={"reverse"}
              selected={variableColorBar.isReversed}
              onChange={handleColorBarReversed}
              size="small"
            >
              <InvertColorsIcon fontSize="inherit" />
            </ToggleButton>
          </Tooltip>
        </Box>
      </Box>
      <Box component="div" sx={styles.opacityContainer}>
        <Box component="span" fontSize="small" sx={styles.opacityLabel}>
          {i18n.get("Opacity")}
        </Box>
        <Slider
          min={0}
          max={1}
          value={variableOpacity}
          step={0.01}
          sx={styles.opacitySlider}
          onChange={handleVariableOpacity}
          size="small"
        />
      </Box>
    </>
  );
}
