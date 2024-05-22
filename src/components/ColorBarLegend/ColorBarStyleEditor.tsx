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

import { MouseEvent } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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

  const handleColorBarNorm = (
    _event: MouseEvent<HTMLElement>,
    value: ColorBarNorm,
  ) => {
    updateVariableColorBar(
      variableColorBarName,
      variableColorBarMinMax,
      value,
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
        <ToggleButtonGroup
          exclusive
          value={variableColorBarNorm}
          onChange={handleColorBarNorm}
          size="small"
        >
          <ToggleButton value="lin" sx={styles.toggleButton}>
            <Box fontSize="small">Lin</Box>
          </ToggleButton>
          <ToggleButton value="log" sx={styles.toggleButton}>
            <Box fontSize="small">Log</Box>
          </ToggleButton>
          <ToggleButton
            value="cat"
            sx={styles.toggleButton}
            disabled={!variableColorBar.categories}
          >
            <Box fontSize="small">Cat</Box>
          </ToggleButton>
        </ToggleButtonGroup>
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
