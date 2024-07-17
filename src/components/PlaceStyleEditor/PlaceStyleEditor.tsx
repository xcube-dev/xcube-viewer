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

import { WithLocale } from "@/util/lang";
import { makeStyles } from "@/util/styles";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import i18n from "@/i18n";
import Slider from "@mui/material/Slider";
import { PlaceStyle } from "@/model/place";
import { MouseEvent, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { userPlaceColorsArray } from "@/config";
import Tooltip from "@mui/material/Tooltip";

const styles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "auto 120px",
    gridTemplateRows: "auto",
    gridTemplateAreas: "'colorLabel colorValue' 'opacityLabel opacityValue'",
    rowGap: 1,
    columnGap: 2.5,
    padding: 1,
  },
  colorLabel: {
    gridArea: "colorLabel",
    alignSelf: "center",
  },
  colorValue: {
    gridArea: "colorValue",
    alignSelf: "center",
    width: "100%",
    height: "22px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  opacityLabel: {
    gridArea: "opacityLabel",
    alignSelf: "center",
  },
  opacityValue: {
    gridArea: "opacityValue",
    alignSelf: "center",
    width: "100%",
  },
  colorMenuItem: { padding: "4px 8px 4px 8px" },
  colorMenuItemBox: { width: "104px", height: "18px" },
});

interface FeatureStyleEditorProps extends WithLocale {
  anchorEl: HTMLElement | null;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  placeStyle: PlaceStyle;
  updatePlaceStyle: (placeStyle: PlaceStyle) => void;
}

const PlaceStyleEditor = ({
  anchorEl,
  setAnchorEl,
  placeStyle,
  updatePlaceStyle,
}: FeatureStyleEditorProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  function handleColorClick(event: MouseEvent<HTMLDivElement>) {
    setMenuAnchorEl(event.currentTarget);
  }

  return (
    <>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={styles.container}>
          <Typography sx={styles.colorLabel}>{i18n.get("Color")}</Typography>
          <Typography sx={styles.opacityLabel}>
            {i18n.get("Opacity")}
          </Typography>
          <Box
            sx={styles.colorValue}
            style={{ backgroundColor: placeStyle.color }}
            onClick={handleColorClick}
          />
          <Slider
            sx={styles.opacityValue}
            size="small"
            min={0}
            max={1}
            step={0.05}
            value={placeStyle.opacity}
            onChange={(_, value) =>
              updatePlaceStyle({ ...placeStyle, opacity: value as number })
            }
          />
        </Box>
      </Popover>
      <Menu
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
      >
        {userPlaceColorsArray.map(([colorName, _]) => (
          <MenuItem
            key={colorName}
            selected={placeStyle.color === colorName}
            sx={styles.colorMenuItem}
            onClick={() =>
              updatePlaceStyle({ ...placeStyle, color: colorName })
            }
          >
            <Tooltip title={colorName}>
              <Box
                sx={{
                  ...styles.colorMenuItemBox,
                  backgroundColor: colorName,
                }}
              />
            </Tooltip>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default PlaceStyleEditor;
