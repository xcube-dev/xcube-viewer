/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";

import { makeStyles } from "@/util/styles";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import useMapPointInfo from "./useMapPointInfo";
import MapPointInfoContent from "./MapPointInfoContent";

const styles = makeStyles({
  container: {
    position: "absolute",
    zIndex: 1000,
    backgroundColor: "#000000A0",
    color: "#fff",
    border: "1px solid #FFFFFF50",
    borderRadius: "4px",
    transform: "translateX(3%)",
    pointerEvents: "none",
  },
});

interface MapPointInfoBoxProps {
  enabled: boolean;
  serverUrl: string;
  dataset1: Dataset | null;
  variable1: Variable | null;
  dataset2: Dataset | null;
  variable2: Variable | null;
  time: string | null;
}

export default function MapPointInfoBox({
  enabled,
  serverUrl,
  dataset1,
  variable1,
  dataset2,
  variable2,
  time,
}: MapPointInfoBoxProps) {
  const mapPointInfo = useMapPointInfo(
    enabled,
    serverUrl,
    dataset1,
    variable1,
    dataset2,
    variable2,
    time,
  );

  if (!mapPointInfo) {
    return null;
  }

  const { pixelX, pixelY } = mapPointInfo.location;

  // console.info("mapPointInfo", mapPointInfo);

  return (
    <Box sx={{ ...styles.container, left: pixelX, top: pixelY }}>
      <MapPointInfoContent {...mapPointInfo} />
    </Box>
  );
}
