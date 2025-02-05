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
import Paper from "@mui/material/Paper";

import i18n from "@/i18n";
import { Time } from "@/model/timeSeries";
import { Variable } from "@/model/variable";
import { ApiServerConfig } from "@/model/apiServer";
import { isUserVariable } from "@/model/userVariable";
import { ViewMode } from "@/components/InfoPanel/common/types";
import { getVariablePythonCode, selectObj } from "./common/utils";
import JsonCodeContent from "./common/JsonCodeContent";
import CardContent2 from "./common/CardContent2";
import KeyValueTable, { KeyValue } from "./common/KeyValueTable";
import PythonCodeContent from "./common/PythonCodeContent";
import InfoCardContent from "./common/InfoCardContent";

import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  variableHtmlReprContainer: (theme) => ({
    background: theme.palette.divider,
    padding: 1,
    marginTop: 1,
    marginBottom: 1,
  }),
});

interface VariableInfoContentProps {
  isIn: boolean;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  variable: Variable;
  time: Time | null;
  serverConfig: ApiServerConfig;
  hasPython: boolean;
}

const VariableInfoContent: React.FC<VariableInfoContentProps> = ({
  isIn,
  viewMode,
  setViewMode,
  variable,
  time,
  serverConfig,
  hasPython,
}) => {
  let content;
  let htmlReprPaper;
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
      <CardContent2>
        <KeyValueTable
          data={Object.getOwnPropertyNames(variable.attrs || {}).map((name) => [
            name,
            variable.attrs[name],
          ])}
        />
      </CardContent2>
    );
    if (variable.htmlRepr) {
      const handleRef = (element: HTMLDivElement | null) => {
        if (element && variable.htmlRepr) {
          element.innerHTML = variable.htmlRepr;
        }
      };
      htmlReprPaper = (
        <CardContent2>
          <Paper ref={handleRef} sx={styles.variableHtmlReprContainer} />
        </CardContent2>
      );
    }
  } else if (viewMode === "text") {
    let data: KeyValue[] = [
      [i18n.get("Name"), variable.name],
      [i18n.get("Title"), variable.title],
      [i18n.get("Units"), variable.units],
    ];
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
      <CardContent2>
        <KeyValueTable data={data} />
      </CardContent2>
    );
  } else if (viewMode === "python") {
    content = (
      <PythonCodeContent
        code={getVariablePythonCode(serverConfig, variable, time)}
      />
    );
  }
  return (
    <InfoCardContent
      title={variable.title || variable.name}
      subheader={`${i18n.get("Name")}: ${variable.name}`}
      isIn={isIn}
      viewMode={viewMode}
      setViewMode={setViewMode}
      hasPython={hasPython}
    >
      {htmlReprPaper}
      {content}
    </InfoCardContent>
  );
};

export default VariableInfoContent;
