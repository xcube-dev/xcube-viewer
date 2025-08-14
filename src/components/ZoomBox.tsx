/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, useMemo } from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { default as OlMap } from "ol/Map";

import { getLabelForValue } from "@/util/label";
import { makeStyles } from "@/util/styles";
import { MAP_OBJECTS } from "@/states/controlState";

const styles = makeStyles({
  container: (theme) => ({
    position: "absolute",
    zIndex: 1000,
    border: "red",
    borderRadius: "5px",
    boxShadow:
      "0 3px 3px 0 rgba(0, 0, 0, 0.2), 1px 4px 4px 1px rgba(0, 0, 0, 0.2)",
    backgroundColor: theme.palette.background.default,
    width: "140px",
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

interface ZoomBoxProps {
  style: CSSProperties;
  zoomLevel: number | undefined;
  datasetLevel: () => number | undefined;
}

export default function ZoomBox({
  style,
  zoomLevel,
  datasetLevel,
}: ZoomBoxProps): JSX.Element {
  const map = MAP_OBJECTS["map"] as OlMap | undefined;
  const view = map?.getView();

  const [currentZoom, setCurrentZoom] = useState<number | undefined>(zoomLevel);
  const [currentDatasetLevel, setCurrentDatasetLevel] = useState<
    number | undefined
  >(() => datasetLevel());

  useMemo(() => {
    setCurrentDatasetLevel(datasetLevel());
  }, [datasetLevel]);

  useEffect(() => {
    if (!view) return;

    const handleZoomChange = () => {
      setCurrentZoom(view.getZoom());
      setCurrentDatasetLevel(datasetLevel());
    };

    view.on("change:resolution", handleZoomChange);
    return () => {
      view.un("change:resolution", handleZoomChange);
    };
  }, [view, datasetLevel]);

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
            color="textSecondary"
          >
            {currentZoom !== undefined
              ? getLabelForValue(currentZoom, 4)
              : "no zoom level"}
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Typography sx={styles.title} variant="subtitle1" color="textPrimary">
            {"Dataset Level"}
          </Typography>
          <Typography
            sx={styles.subTitle}
            variant="subtitle2"
            color="textSecondary"
          >
            {currentDatasetLevel !== undefined
              ? getLabelForValue(currentDatasetLevel, 4)
              : "no dataset level"}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
