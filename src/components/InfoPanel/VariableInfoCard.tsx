/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { ReactNode } from "react";
import LayersIcon from "@mui/icons-material/Layers";

import i18n from "@/i18n";
import { type Time } from "@/model/timeSeries";
import { type Variable } from "@/model/variable";
import { type ApiServerConfig } from "@/model/apiServer";
import { isUserVariable } from "@/model/userVariable";
import Markdown from "@/components/Markdown";
import { type ViewMode } from "./common/types";
import { getVariablePythonCode, selectObj } from "./common/utils";
import JsonCodeContent from "./common/JsonCodeContent";
import InfoCardContent from "./common/InfoCardContent";
import KeyValueContent, { type KeyValue } from "./common/KeyValueContent";
import PythonCodeContent from "./common/PythonCodeContent";
import InfoCard from "./common/InfoCard";
import HtmlContent from "./common/HtmlContent";

interface VariableInfoContentProps {
  expanded: boolean;
  onExpandedStateChange: (expanded: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  variable: Variable | null | undefined;
  time: Time | null;
  serverConfig: ApiServerConfig;
  hasPython: boolean;
}

const VariableInfoCard: React.FC<VariableInfoContentProps> = ({
  expanded,
  onExpandedStateChange,
  viewMode,
  setViewMode,
  variable,
  time,
  serverConfig,
  hasPython,
}) => {
  if (!variable) {
    return null;
  }
  let content: ReactNode = undefined;
  let descriptionMarkdown: ReactNode = undefined;
  let htmlReprContent: ReactNode = undefined;
  if (viewMode === "code") {
    const jsonVariable = selectObj(variable, [
      "id",
      "name",
      "title",
      "units",
      "expression",
      "shape",
      "dtype",
      "shape",
      "timeChunkSize",
      "colorBarMin",
      "colorBarMax",
      "colorBarName",
      "attrs",
    ]);
    content = <JsonCodeContent code={JSON.stringify(jsonVariable, null, 2)} />;
  } else if (viewMode === "list") {
    content = (
      <InfoCardContent>
        <KeyValueContent
          data={Object.getOwnPropertyNames(variable.attrs || {}).map((name) => [
            name,
            variable.attrs[name],
          ])}
          types
        />
      </InfoCardContent>
    );
  } else if (viewMode === "text") {
    const descriptionText =
      variable.description ||
      variable.attrs["description"] ||
      variable.attrs["abstract"] ||
      variable.attrs["comment"];
    descriptionMarkdown = typeof descriptionText === "string" && (
      <InfoCardContent>
        <Markdown text={descriptionText} />
      </InfoCardContent>
    );

    htmlReprContent = variable.htmlRepr && (
      <HtmlContent innerHTML={variable.htmlRepr} />
    );

    let data: KeyValue[] = [[i18n.get("Units"), variable.units]];
    if (isUserVariable(variable)) {
      data.push([i18n.get("Expression"), variable.expression]);
    } else {
      data = [
        ...data,
        [i18n.get("Data type"), variable.dtype],
        [i18n.get("Dimension names"), variable.dims.join(", ")],
        [
          i18n.get("Dimension lengths"),
          variable.shape.map((s) => s + "").join(", "),
        ],
        [i18n.get("Time chunk size"), variable.timeChunkSize],
      ];
    }

    content = (
      <InfoCardContent>
        <KeyValueContent data={data} />
      </InfoCardContent>
    );
  } else if (viewMode === "python") {
    content = (
      <PythonCodeContent
        code={getVariablePythonCode(serverConfig, variable, time)}
      />
    );
  }
  return (
    <InfoCard
      expanded={expanded}
      onExpandedStateChange={onExpandedStateChange}
      title={variable.title || `<${i18n.get("No Title")}>`}
      subheader={`${i18n.get("Name")}: ${variable.name}`}
      tooltipText={i18n.get("Information about the selected variable")}
      icon={<LayersIcon />}
      viewMode={viewMode}
      setViewMode={setViewMode}
      hasPython={hasPython}
    >
      {descriptionMarkdown}
      {content}
      {htmlReprContent}
    </InfoCard>
  );
};

export default VariableInfoCard;
