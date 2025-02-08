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
import Box from "@mui/material/Box";

import { WithLocale } from "@/util/lang";
import { Dataset } from "@/model/dataset";
import { PlaceInfo } from "@/model/place";
import { Time } from "@/model/timeSeries";
import { Variable } from "@/model/variable";
import { ApiServerConfig } from "@/model/apiServer";
import { ViewMode } from "./common/types";
import DatasetInfoContent from "./DatasetInfoContent";
import VariableInfoContent from "./VariableInfoContent";
import PlaceInfoContent from "./PlaceInfoContent";
import { commonSx } from "@/components/InfoPanel/common/styles";

interface InfoPanelProps extends WithLocale {
  visibleInfoCardElements: string[];
  setVisibleInfoCardElements: (visibleInfoCardElements: string[]) => void;
  infoCardElementViewModes: { [elementType: string]: ViewMode };
  updateInfoCardElementViewMode: (
    elementType: string,
    viewMode: ViewMode,
  ) => void;
  selectedDataset: Dataset | null;
  selectedVariable: Variable | null;
  selectedPlaceInfo: PlaceInfo | null;
  selectedTime: Time | null;
  serverConfig: ApiServerConfig;
  allowViewModePython: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  visibleInfoCardElements,
  setVisibleInfoCardElements,
  infoCardElementViewModes,
  updateInfoCardElementViewMode,
  selectedDataset,
  selectedVariable,
  selectedPlaceInfo,
  selectedTime,
  serverConfig,
  allowViewModePython,
}) => {
  const _setVisibleElementType = (
    visibleElementType: string,
    expanded: boolean,
  ) => {
    const elementTypeSet = new Set(visibleInfoCardElements);
    if (!expanded && elementTypeSet.has(visibleElementType)) {
      elementTypeSet.delete(visibleElementType);
    }
    if (expanded && !elementTypeSet.has(visibleElementType)) {
      elementTypeSet.add(visibleElementType);
    }
    setVisibleInfoCardElements([...elementTypeSet]);
  };

  const setPlaceInfoExpandedState = (expanded: boolean) =>
    _setVisibleElementType("place", expanded);
  const setPlaceInfoViewMode = (viewMode: ViewMode) =>
    updateInfoCardElementViewMode("place", viewMode);

  const setVariableInfoExpendedState = (expanded: boolean) =>
    _setVisibleElementType("variable", expanded);
  const setVariableInfoViewMode = (viewMode: ViewMode) =>
    updateInfoCardElementViewMode("variable", viewMode);

  const setDatasetInfoExpandedState = (expanded: boolean) =>
    _setVisibleElementType("dataset", expanded);
  const setDatasetInfoViewMode = (viewMode: ViewMode) =>
    updateInfoCardElementViewMode("dataset", viewMode);

  return (
    <Box sx={commonSx.card}>
      <DatasetInfoContent
        expanded={visibleInfoCardElements.includes("dataset")}
        onExpandedStateChange={setDatasetInfoExpandedState}
        viewMode={infoCardElementViewModes["dataset"]}
        setViewMode={setDatasetInfoViewMode}
        dataset={selectedDataset}
        serverConfig={serverConfig}
        hasPython={allowViewModePython}
      />
      <VariableInfoContent
        expanded={visibleInfoCardElements.includes("variable")}
        onExpandedStateChange={setVariableInfoExpendedState}
        viewMode={infoCardElementViewModes["variable"]}
        setViewMode={setVariableInfoViewMode}
        variable={selectedVariable}
        time={selectedTime}
        serverConfig={serverConfig}
        hasPython={allowViewModePython}
      />
      <PlaceInfoContent
        expanded={visibleInfoCardElements.includes("place")}
        onExpandedStateChange={setPlaceInfoExpandedState}
        viewMode={infoCardElementViewModes["place"]}
        setViewMode={setPlaceInfoViewMode}
        placeInfo={selectedPlaceInfo}
      />
    </Box>
  );
};

export default InfoPanel;
