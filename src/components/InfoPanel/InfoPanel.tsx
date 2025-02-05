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
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Tooltip from "@mui/material/Tooltip";
import LayersIcon from "@mui/icons-material/Layers";
import PlaceIcon from "@mui/icons-material/Place";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { Dataset } from "@/model/dataset";
import { PlaceInfo } from "@/model/place";
import { Time } from "@/model/timeSeries";
import { Variable } from "@/model/variable";
import { ApiServerConfig } from "@/model/apiServer";
import { commonStyles } from "@/components/common-styles";
import { commonSx } from "./common/styles";
import { ViewMode } from "./common/types";
import DatasetInfoContent from "./DatasetInfoContent";
import VariableInfoContent from "./VariableInfoContent";
import PlaceInfoContent from "./PlaceInfoContent";

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
  const handleInfoElementsChanges = (
    _event: React.MouseEvent<HTMLElement>,
    visibleElementTypes: string[],
  ) => {
    setVisibleInfoCardElements(visibleElementTypes);
  };

  let datasetInfoContent;
  let variableInfoContent;
  let placeInfoContent;
  if (selectedDataset) {
    const elementType = "dataset";
    const viewMode = infoCardElementViewModes[elementType];
    const setViewMode = (viewMode: ViewMode) =>
      updateInfoCardElementViewMode(elementType, viewMode);
    const isVisible = visibleInfoCardElements.includes(elementType);
    datasetInfoContent = (
      <DatasetInfoContent
        isIn={isVisible}
        viewMode={viewMode}
        setViewMode={setViewMode}
        dataset={selectedDataset}
        serverConfig={serverConfig}
        hasPython={allowViewModePython}
      />
    );
  }
  if (selectedDataset && selectedVariable) {
    const elementType = "variable";
    const viewMode = infoCardElementViewModes[elementType];
    const setViewMode = (viewMode: ViewMode) =>
      updateInfoCardElementViewMode(elementType, viewMode);
    const isVisible = visibleInfoCardElements.includes(elementType);
    variableInfoContent = (
      <VariableInfoContent
        isIn={isVisible}
        viewMode={viewMode}
        setViewMode={setViewMode}
        variable={selectedVariable}
        time={selectedTime}
        serverConfig={serverConfig}
        hasPython={allowViewModePython}
      />
    );
  }
  if (selectedPlaceInfo) {
    const elementType = "place";
    const viewMode = infoCardElementViewModes[elementType];
    const setViewMode = (viewMode: ViewMode) =>
      updateInfoCardElementViewMode(elementType, viewMode);
    const isVisible = visibleInfoCardElements.includes(elementType);
    placeInfoContent = (
      <PlaceInfoContent
        isIn={isVisible}
        viewMode={viewMode}
        setViewMode={setViewMode}
        placeInfo={selectedPlaceInfo}
      />
    );
  }

  return (
    <Card sx={commonSx.card}>
      <CardActions disableSpacing>
        <ToggleButtonGroup
          key={0}
          size="small"
          value={visibleInfoCardElements}
          onChange={handleInfoElementsChanges}
        >
          <ToggleButton
            key={0}
            value="dataset"
            disabled={selectedDataset === null}
            size="small"
            sx={commonStyles.toggleButton}
          >
            <Tooltip arrow title={i18n.get("Dataset information")}>
              <WidgetsIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton
            key={1}
            value="variable"
            disabled={selectedVariable === null}
            size="small"
            sx={commonStyles.toggleButton}
          >
            <Tooltip arrow title={i18n.get("Variable information")}>
              <LayersIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton
            key={2}
            value="place"
            disabled={selectedPlaceInfo === null}
            size="small"
            sx={commonStyles.toggleButton}
          >
            <Tooltip arrow title={i18n.get("Place information")}>
              <PlaceIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </CardActions>
      {datasetInfoContent}
      {variableInfoContent}
      {placeInfoContent}
    </Card>
  );
};

export default InfoPanel;
