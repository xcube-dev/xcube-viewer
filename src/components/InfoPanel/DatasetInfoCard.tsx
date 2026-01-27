/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { ReactNode } from "react";

import i18n from "@/i18n";
import Markdown from "@/components/Markdown";
import { type Dataset } from "@/model/dataset";
import { type ApiServerConfig } from "@/model/apiServer";
import { getLabelForValue } from "@/util/label";
import { type ViewMode } from "./common/types";
import { type KeyValue } from "./common/KeyValueContent";
import KeyValueContent from "./common/KeyValueContent";
import PythonCodeContent from "./common/PythonCodeContent";
import { getDatasetPythonCode, selectObj } from "./common/utils";
import JsonCodeContent from "./common/JsonCodeContent";
import InfoCard from "./common/InfoCard";
import InfoCardContent from "./common/InfoCardContent";
import WidgetsIcon from "@mui/icons-material/Widgets";

interface DatasetInfoContentProps {
  expanded: boolean;
  onExpandedStateChange: (expanded: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  dataset: Dataset | null | undefined;
  serverConfig: ApiServerConfig;
  hasPython: boolean;
}

const DatasetInfoCard: React.FC<DatasetInfoContentProps> = ({
  expanded,
  onExpandedStateChange,
  viewMode,
  setViewMode,
  dataset,
  serverConfig,
  hasPython,
}) => {
  if (!dataset) {
    return null;
  }
  // const classes = useStyles();
  let content: ReactNode = undefined;
  let descriptionMarkdown: ReactNode = undefined;
  if (viewMode === "code") {
    const jsonDimensions = dataset.dimensions.map((dim) =>
      selectObj(dim, ["name", "size", "dtype"]),
    );
    const jsonDataset = selectObj(dataset, ["id", "title", "bbox", "attrs"]);
    jsonDataset["dimensions"] = jsonDimensions;
    content = <JsonCodeContent code={JSON.stringify(jsonDataset, null, 2)} />;
  } else if (viewMode === "list") {
    content = (
      <InfoCardContent>
        <KeyValueContent
          data={Object.getOwnPropertyNames(dataset.attrs || {}).map((name) => [
            name,
            dataset.attrs[name],
          ])}
          types
        />
      </InfoCardContent>
    );
  } else if (viewMode === "text") {
    const descriptionText: unknown =
      dataset.description ||
      dataset.attrs["description"] ||
      dataset.attrs["abstract"] ||
      dataset.attrs["comment"];
    descriptionMarkdown = typeof descriptionText === "string" && (
      <InfoCardContent>
        <Markdown text={descriptionText} />
      </InfoCardContent>
    );

    const data: KeyValue[] = [
      [
        i18n.get("Dimension names"),
        dataset.dimensions.map((d) => d.name).join(", "),
      ],
      [
        i18n.get("Dimension lengths"),
        dataset.dimensions.map((d) => d.size).join(", "),
      ],
      [
        i18n.get("Dimension data types"),
        dataset.dimensions.map((d) => d.dtype).join(", "),
      ],
      [
        i18n.get("Geographical extent") + " (x1, y1, x2, y2)",
        dataset.bbox.map((x) => getLabelForValue(x, 3)).join(", "),
      ],
      [i18n.get("Spatial reference system"), dataset.spatialRef],
      [i18n.get("Levels"), dataset.resolutions.length],
    ];
    content = (
      <InfoCardContent>
        <KeyValueContent data={data} />
      </InfoCardContent>
    );
  } else if (viewMode === "python") {
    content = (
      <PythonCodeContent code={getDatasetPythonCode(serverConfig, dataset)} />
    );
  }
  return (
    <InfoCard
      expanded={expanded}
      onExpandedStateChange={onExpandedStateChange}
      title={dataset.title || `<${i18n.get("No Title")}>`}
      subheader={`${i18n.get("ID")}: ${dataset.id}`}
      tooltipText={i18n.get("Information about the selected dataset")}
      icon={<WidgetsIcon />}
      viewMode={viewMode}
      setViewMode={setViewMode}
      hasPython={hasPython}
    >
      {descriptionMarkdown}
      {content}
    </InfoCard>
  );
};

export default DatasetInfoCard;
