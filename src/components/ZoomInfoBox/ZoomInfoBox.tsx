/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { getLabelForValue } from "@/util/label";
import { makeStyles } from "@/util/styles";
import { getBorderStyle } from "@/components/ColorBarLegend/style";

const styles = makeStyles({
  container: (theme) => ({
    position: "absolute",
    zIndex: 1000,
    border: getBorderStyle(theme),
    borderRadius: "4px",
    backgroundColor: alpha(theme.palette.background.default, 0.85),
    minWidth: "120px",
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 1,
  }),
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

interface ZoomInfoBoxProps {
  style: CSSProperties;
  zoomLevel: number | undefined;
  datasetLevel: number | undefined;
  datasetLevels: number;
  visibility: boolean;
}

export default function ZoomInfoBox({
  style,
  zoomLevel,
  datasetLevel,
  datasetLevels,
  visibility,
}: ZoomInfoBoxProps): JSX.Element | null {
  if (!visibility) {
    return null;
  }

  return (
    <div>
      <Box
        //className="ol-unselectable ol-control"
        sx={styles.container}
        style={style}
      >
        <Box>
          <Typography sx={styles.title} variant="subtitle1" color="textPrimary">
            {"Zoom"}
          </Typography>
          <Typography
            sx={styles.subTitle}
            variant="subtitle2"
            color="textPrimary"
          >
            {zoomLevel !== undefined
              ? getLabelForValue(zoomLevel, 4)
              : "no zoom level"}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <Typography sx={styles.title} variant="subtitle1" color="textPrimary">
            {"Level"}
          </Typography>
          <Typography
            sx={styles.subTitle}
            variant="subtitle2"
            color="textPrimary"
          >
            {/*            increment datasetLevel with +1, so that the dataset level range
            starts with 1 instead of 0.*/}
            {datasetLevel !== undefined
              ? getLabelForValue(datasetLevel + 1, 0) +
                " / " +
                getLabelForValue(datasetLevels, 0)
              : "no dataset level"}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
