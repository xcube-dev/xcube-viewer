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

import { utcTimeToIsoDateTimeString } from "@/util/time";
import { Dataset } from "@/model/dataset";
import { Time } from "@/model/timeSeries";
import { Variable } from "@/model/variable";
import { ApiServerConfig } from "@/model/apiServer";
import { isUserVariable } from "@/model/userVariable";

export function selectObj<T extends object>(
  obj: T,
  keys: Array<keyof T>,
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in obj) {
      newObj[key as string] = obj[key];
    }
  }
  return newObj;
}

export function getDatasetPythonCode(
  serverConfig: ApiServerConfig,
  dataset: Dataset,
) {
  const datasetId = getS3DataId(dataset.id);
  return [
    "from xcube.core.store import new_data_store",
    "",
    "store = new_data_store(",
    '    "s3",',
    '    root="datasets",  # can also use "pyramids" here',
    "    storage_options={",
    '        "anon": True,',
    '        "client_kwargs": {',
    `            "endpoint_url": "${serverConfig.url}/s3"`,
    "        }",
    "    }",
    ")",
    `# store.list_data_ids()`,
    `dataset = store.open_data(data_id="${datasetId}")`,
  ].join("\n");
}

export function getVariablePythonCode(
  _serverConfig: ApiServerConfig,
  variable: Variable,
  time: Time | null,
) {
  const name = variable.name;
  const vmin = variable.colorBarMin;
  const vmax = variable.colorBarMax;
  const cmap = variable.colorBarName;
  let timeSel = "";
  if (time !== null) {
    timeSel = `sel(time="${utcTimeToIsoDateTimeString(time)}", method="nearest")`;
  }
  const code: string[] = [];
  if (isUserVariable(variable)) {
    const expression = variable.expression;
    code.push("from xcube.util.expression import compute_array_expr");
    code.push("from xcube.util.expression import new_dataset_namespace");
    code.push("");
    code.push(`namespace = new_dataset_namespace(dataset)`);
    code.push(`${name} = compute_array_expr("${expression}", namespace`);
    if (timeSel) {
      code.push(`${name} = ${name}.${timeSel}`);
    }
  } else {
    if (timeSel) {
      code.push(`${name} = dataset.${name}.${timeSel}`);
    } else {
      code.push(`${name} = dataset.${name}`);
    }
  }
  code.push(`${name}.plot.imshow(vmin=${vmin}, vmax=${vmax}, cmap="${cmap}")`);
  return code.join("\n");
}

function getS3DataId(originalId: string): string {
  return splitExt(originalId)[0] + ".zarr";
}

function splitExt(name: string): [string, string] {
  const index = name.lastIndexOf(".");
  if (index >= 0) {
    return [name.substring(0, index), name.substring(index)];
  } else {
    return [name, ""];
  }
}
