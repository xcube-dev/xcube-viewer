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

import React, { ReactNode } from "react";

import i18n from "@/i18n";
import Markdown from "@/components/Markdown";
import { type Dataset } from "@/model/dataset";
import { type ApiServerConfig } from "@/model/apiServer";
import { getLabelForValue } from "@/util/label";
import { type ViewMode } from "./common/types";
import { type KeyValue } from "./common/KeyValueTable";
import KeyValueTable from "./common/KeyValueTable";
import PythonCodeContent from "./common/PythonCodeContent";
import { getDatasetPythonCode, selectObj } from "./common/utils";
import JsonCodeContent from "./common/JsonCodeContent";
import InfoCardContent from "./common/InfoCardContent";
import CardContent2 from "./common/CardContent2";
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

const DatasetInfoContent: React.FC<DatasetInfoContentProps> = ({
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
      <CardContent2>
        <KeyValueTable
          data={Object.getOwnPropertyNames(dataset.attrs || {}).map((name) => [
            name,
            dataset.attrs[name],
          ])}
        />
      </CardContent2>
    );
  } else if (viewMode === "text") {
    const descriptionText: unknown =
      dataset.description ||
      dataset.attrs["description"] ||
      dataset.attrs["abstract"] ||
      dataset.attrs["comment"];
    descriptionMarkdown = typeof descriptionText === "string" && (
      <CardContent2>
        <Markdown text={descriptionText} />
      </CardContent2>
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
    ];
    content = (
      <CardContent2>
        <KeyValueTable data={data} />
      </CardContent2>
    );
  } else if (viewMode === "python") {
    content = (
      <PythonCodeContent code={getDatasetPythonCode(serverConfig, dataset)} />
    );
  }
  return (
    <InfoCardContent
      expanded={expanded}
      onExpandedStateChange={onExpandedStateChange}
      title={dataset.title || `<${i18n.get("No Title")}>`}
      subheader={`${i18n.get("Dataset ID")}: ${dataset.id}`}
      tooltipText={i18n.get("Dataset information")}
      icon={<WidgetsIcon />}
      viewMode={viewMode}
      setViewMode={setViewMode}
      hasPython={hasPython}
    >
      {descriptionMarkdown}
      {content}
    </InfoCardContent>
  );
};

export default DatasetInfoContent;
