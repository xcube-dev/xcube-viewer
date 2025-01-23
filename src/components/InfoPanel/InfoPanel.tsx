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
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import JsonIcon from "@mui/icons-material/DataObject";
import LayersIcon from "@mui/icons-material/Layers";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PlaceIcon from "@mui/icons-material/Place";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { Extension } from "@codemirror/state";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { utcTimeToIsoDateTimeString } from "@/util/time";
import { Dataset } from "@/model/dataset";
import { PlaceInfo } from "@/model/place";
import { Time } from "@/model/timeSeries";
import { Variable } from "@/model/variable";
import pythonLogo from "@/resources/python-bw.png";
import { ApiServerConfig } from "@/model/apiServer";
import { commonStyles } from "@/components/common-styles";
import { makeStyles } from "@/util/styles";
import { isUserVariable } from "@/model/userVariable";
import { useTheme } from "@mui/material";

type ViewMode = "text" | "list" | "code" | "python";
const styles = makeStyles({
  card: (theme) => ({
    maxWidth: "100%",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  }),
  info: (theme) => ({
    marginRight: theme.spacing(1),
  }),
  close: {
    marginLeft: "auto",
  },
  table: {},
  keyValueTableContainer: (theme) => ({
    background: theme.palette.divider,
  }),
  variableHtmlReprContainer: (theme) => ({
    background: theme.palette.divider,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }),
  media: {
    height: 200,
  },
  cardContent: {
    padding: "8px",
  },
  code: {
    fontFamily: "Monospace",
  },
});

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

  // TODO (forman): fix ugly code duplication below!
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
    <Card sx={styles.card}>
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

////////////////////////////////////////////////////////////////////////////////

interface DatasetInfoContentProps {
  isIn: boolean;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  dataset: Dataset;
  serverConfig: ApiServerConfig;
  hasPython: boolean;
}

const DatasetInfoContent: React.FC<DatasetInfoContentProps> = ({
  isIn,
  viewMode,
  setViewMode,
  dataset,
  serverConfig,
  hasPython,
}) => {
  // const classes = useStyles();
  let content;
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
    const data: KeyValue[] = [
      [
        i18n.get("Dimension names"),
        dataset.dimensions.map((d) => d.name).join(", "),
      ],
      [
        i18n.get("Dimension data types"),
        dataset.dimensions.map((d) => d.dtype).join(", "),
      ],
      [
        i18n.get("Dimension lengths"),
        dataset.dimensions.map((d) => d.size).join(", "),
      ],
      [
        i18n.get("Geographical extent") + " (x1, y1, x2, y2)",
        dataset.bbox.map((x) => x + "").join(", "),
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
      title={dataset.title || "?"}
      subheader={dataset.title && `ID: ${dataset.id}`}
      isIn={isIn}
      viewMode={viewMode}
      setViewMode={setViewMode}
      hasPython={hasPython}
    >
      {content}
    </InfoCardContent>
  );
};

////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////

interface PlaceInfoContentProps {
  isIn: boolean;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  placeInfo: PlaceInfo;
}

const PlaceInfoContent: React.FC<PlaceInfoContentProps> = ({
  isIn,
  viewMode,
  setViewMode,
  placeInfo,
}) => {
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
        <CardContent2>
          <KeyValueTable data={data} />
        </CardContent2>
      );
    } else {
      content = (
        <CardContent2>
          <Typography>
            {i18n.get("There is no information available for this location.")}
          </Typography>
        </CardContent2>
      );
    }
  } else {
    if (placeInfo.image && placeInfo.image.startsWith("http")) {
      image = (
        <CardMedia
          sx={styles.media}
          image={placeInfo.image}
          title={placeInfo.label}
        />
      );
    }
    if (placeInfo.description) {
      description = (
        <CardContent2>
          <Typography>{placeInfo.description}</Typography>
        </CardContent2>
      );
    }
  }
  return (
    <InfoCardContent
      title={placeInfo.label}
      subheader={`${i18n.get("Geometry type")}: ${i18n.get(place.geometry.type)}`}
      isIn={isIn}
      viewMode={viewMode}
      setViewMode={setViewMode}
    >
      {image}
      {description}
      {content}
    </InfoCardContent>
  );
};

////////////////////////////////////////////////////////////////////////////////

interface InfoCardContentProps {
  isIn: boolean;
  title: React.ReactNode;
  subheader?: React.ReactNode;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  hasPython?: boolean;
  children?: React.ReactNode;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  isIn,
  title,
  subheader,
  viewMode,
  setViewMode,
  hasPython,
  children,
}) => {
  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    viewMode: ViewMode,
  ) => {
    setViewMode(viewMode);
  };

  return (
    <Collapse in={isIn} timeout="auto" unmountOnExit>
      <CardHeader
        title={title}
        subheader={subheader}
        titleTypographyProps={{ fontSize: "1.1em" }}
        action={
          <ToggleButtonGroup
            key={0}
            size="small"
            value={viewMode}
            exclusive={true}
            onChange={handleViewModeChange}
          >
            <ToggleButton
              key={0}
              value="text"
              size="small"
              sx={commonStyles.toggleButton}
            >
              <Tooltip arrow title={i18n.get("Textual format")}>
                <TextFieldsIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              key={1}
              value="list"
              size="small"
              sx={commonStyles.toggleButton}
            >
              <Tooltip arrow title={i18n.get("Tabular format")}>
                <ListAltIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              key={2}
              value="code"
              size="small"
              sx={commonStyles.toggleButton}
            >
              <Tooltip arrow title={i18n.get("JSON format")}>
                <JsonIcon />
              </Tooltip>
            </ToggleButton>
            {hasPython && (
              <ToggleButton
                key={3}
                value="python"
                size="small"
                sx={{ ...commonStyles.toggleButton, width: "30px" }}
              >
                <img src={pythonLogo} width={16} alt="python logo" />
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        }
      />
      {children}
    </Collapse>
  );
};

////////////////////////////////////////////////////////////////////////////////

type KeyValue = [string, React.ReactNode];

interface KeyValueTableProps {
  data: KeyValue[];
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={styles.keyValueTableContainer}>
      <Table sx={styles.table} size="small">
        <TableBody>
          {data.map((kv, index) => {
            const [key, value] = kv;
            let renderedValue = value;
            // noinspection HttpUrlsUsage
            if (
              typeof value === "string" &&
              (value.startsWith("http://") || value.startsWith("https://"))
            ) {
              renderedValue = (
                <Link href={value} target="_blank" rel="noreferrer">
                  {value}
                </Link>
              );
            } else if (Array.isArray(value)) {
              renderedValue = "[" + value.map((v) => v + "").join(", ") + "]";
            }
            return (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                <TableCell align="right">{renderedValue}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

////////////////////////////////////////////////////////////////////////////////
interface CardContent2Props {
  children: React.ReactNode;
}

const CardContent2: React.FC<CardContent2Props> = ({ children }) => {
  return <CardContent sx={styles.cardContent}>{children}</CardContent>;
};

////////////////////////////////////////////////////////////////////////////////

interface CodeContentBaseProps {
  code: string;
}

interface CodeContentProps extends CodeContentBaseProps {
  extension: Extension;
}

const CodeContent: React.FC<CodeContentProps> = ({ code, extension }) => {
  const themeMode = useTheme();
  return (
    <CardContent2>
      <CodeMirror
        theme={themeMode.palette.mode}
        height="320px"
        extensions={[extension]}
        value={code}
        readOnly={true}
      />
    </CardContent2>
  );
};

const JsonCodeContent: React.FC<CodeContentBaseProps> = ({ code }) => {
  return <CodeContent code={code} extension={json()} />;
};

const PythonCodeContent: React.FC<CodeContentBaseProps> = ({ code }) => {
  return <CodeContent code={code} extension={python()} />;
};

////////////////////////////////////////////////////////////////////////////////

function selectObj<T extends object>(
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

function getDatasetPythonCode(serverConfig: ApiServerConfig, dataset: Dataset) {
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

function getVariablePythonCode(
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
