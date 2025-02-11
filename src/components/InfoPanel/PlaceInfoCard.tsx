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

import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PlaceIcon from "@mui/icons-material/Place";

import i18n from "@/i18n";
import { type PlaceInfo } from "@/model/place";
import { commonSx } from "./common/styles";
import JsonCodeContent from "./common/JsonCodeContent";
import KeyValueContent, { type KeyValue } from "./common/KeyValueContent";
import { type ViewMode } from "./common/types";
import InfoCard from "./common/InfoCard";
import InfoCardContent from "./common/InfoCardContent";
import Markdown from "@/components/Markdown";

interface PlaceInfoContentProps {
  expanded: boolean;
  onExpandedStateChange: (expanded: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  placeInfo: PlaceInfo | null | undefined;
}

const PlaceInfoCard: React.FC<PlaceInfoContentProps> = ({
  expanded,
  onExpandedStateChange,
  viewMode,
  setViewMode,
  placeInfo,
}) => {
  if (!placeInfo) {
    return null;
  }
  const place = placeInfo.place;
  let content;
  let image;
  let description;
  if (viewMode === "code") {
    content = <JsonCodeContent code={JSON.stringify(place, null, 2)} />;
  } else if (viewMode === "list") {
    if (place.properties) {
      const data: KeyValue[] = Object.getOwnPropertyNames(place.properties).map(
        (name: string) => [name, place.properties![name]],
      );
      content = (
        <InfoCardContent>
          <KeyValueContent data={data} />
        </InfoCardContent>
      );
    } else {
      content = (
        <InfoCardContent>
          <Typography>
            {i18n.get("There is no information available for this location.")}
          </Typography>
        </InfoCardContent>
      );
    }
  } else {
    if (placeInfo.image && placeInfo.image.startsWith("http")) {
      image = (
        <CardMedia
          sx={commonSx.media}
          image={placeInfo.image}
          title={placeInfo.label}
        />
      );
    }
    if (placeInfo.description) {
      description = (
        <InfoCardContent>
          <Markdown text={placeInfo.description} />
        </InfoCardContent>
      );
    }
    if (!image && !description) {
      content = (
        <InfoCardContent>
          <Typography>
            {i18n.get("There is no information available for this location.")}
          </Typography>
        </InfoCardContent>
      );
    }
  }
  return (
    <InfoCard
      expanded={expanded}
      onExpandedStateChange={onExpandedStateChange}
      title={placeInfo.label}
      subheader={`${i18n.get("Geometry type")}: ${i18n.get(place.geometry.type)}`}
      tooltipText={i18n.get("Information about the selected place")}
      icon={<PlaceIcon />}
      viewMode={viewMode}
      setViewMode={setViewMode}
    >
      {image}
      {description}
      {content}
    </InfoCard>
  );
};

export default PlaceInfoCard;
