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
import Paper from "@mui/material/Paper";

import i18n from "@/i18n";
import { type Time } from "@/model/timeSeries";
import { type Variable } from "@/model/variable";
import { type ApiServerConfig } from "@/model/apiServer";
import { isUserVariable } from "@/model/userVariable";
import { type ViewMode } from "./common/types";
import { getVariablePythonCode, selectObj } from "./common/utils";
import JsonCodeContent from "./common/JsonCodeContent";
import InfoCardContent from "./common/InfoCardContent";
import KeyValueContent, { type KeyValue } from "./common/KeyValueContent";
import PythonCodeContent from "./common/PythonCodeContent";
import InfoCard from "./common/InfoCard";

import { makeStyles } from "@/util/styles";
import Markdown from "@/components/Markdown";
import LayersIcon from "@mui/icons-material/Layers";

const styles = makeStyles({
  variableHtmlReprContainer: (theme) => ({
    background: theme.palette.divider,
    padding: 1,
  }),
});

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
  let htmlReprPaper: ReactNode = undefined;
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

    if (variable.htmlRepr) {
      const handleRef = (element: HTMLDivElement | null) => {
        if (element && variable.htmlRepr) {
          element.innerHTML = variable.htmlRepr;
        }
      };
      htmlReprPaper = (
        <InfoCardContent>
          <Paper ref={handleRef} sx={styles.variableHtmlReprContainer} />
        </InfoCardContent>
      );
    }

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
      {htmlReprPaper}
    </InfoCard>
  );
};

export default VariableInfoCard;
