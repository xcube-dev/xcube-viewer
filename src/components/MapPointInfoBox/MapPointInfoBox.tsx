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
    borderRadius: "4px",
    transform: "translateX(3%)",
    pointerEvents: "none",
  },
});

interface MapPointInfoBoxProps {
  enabled: boolean;
  serverUrl: string;
  dataset: Dataset | null;
  variable: Variable | null;
  time: string | null;
}

export default function MapPointInfoBox({
  enabled,
  serverUrl,
  dataset,
  variable,
  time,
}: MapPointInfoBoxProps) {
  const mapPointInfo = useMapPointInfo(
    enabled,
    serverUrl,
    dataset,
    variable,
    time,
  );

  if (!mapPointInfo) {
    return null;
  }

  const { pixelX, pixelY } = mapPointInfo;

  // console.info("mapPointInfo", mapPointInfo);

  return (
    <Box sx={{ ...styles.container, left: pixelX, top: pixelY }}>
      <MapPointInfoContent {...mapPointInfo} />
    </Box>
  );
}
