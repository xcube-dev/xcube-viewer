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

import * as React from "react";
import FormControl from "@mui/material/FormControl";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CategoryIcon from "@mui/icons-material/Category";
// import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FileUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

import i18n from "@/i18n";
import { MapInteraction } from "@/states/controlState";
import { WithLocale } from "@/util/lang";
import ToolButton from "./ToolButton";

const StyledFromControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(2),
}));

interface MapInteractionsBarProps extends WithLocale {
  mapInteraction: MapInteraction;
  setMapInteraction: (interaction: MapInteraction) => void;
}

export default function MapInteractionsBar({
  mapInteraction,
  setMapInteraction,
}: MapInteractionsBarProps) {
  function handleChange(
    _event: React.MouseEvent<HTMLElement>,
    value: MapInteraction | null,
  ) {
    if (value !== null) {
      setMapInteraction(value);
    } else {
      setMapInteraction("Select");
    }
  }

  return (
    <StyledFromControl variant="standard">
      <ToggleButtonGroup
        size="small"
        value={mapInteraction}
        exclusive
        onChange={handleChange}
      >
        <ToolButton
          tooltipText={i18n.get("Select a place in map")}
          toggle
          value="Select"
          key={0}
          icon={<AdsClickIcon />}
        />
        <ToolButton
          tooltipText={i18n.get("Add a point location in map")}
          toggle
          value="Point"
          key={1}
          icon={<AddLocationIcon />}
        />
        <ToolButton
          tooltipText={i18n.get("Draw a polygon area in map")}
          toggle
          value="Polygon"
          key={2}
          icon={<CategoryIcon />}
        />
        <ToolButton
          tooltipText={i18n.get("Draw a circular area in map")}
          toggle
          value="Circle"
          key={3}
          icon={<FiberManualRecordIcon />}
        />
        <ToolButton
          tooltipText={i18n.get("Import places")}
          toggle
          value="Geometry"
          key={4}
          icon={<FileUploadIcon />}
        />
      </ToggleButtonGroup>
    </StyledFromControl>
  );
}
