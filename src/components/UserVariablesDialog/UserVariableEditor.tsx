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

import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";

import i18n from "@/i18n";
import { Dataset } from "@/model/dataset";
import {
  ExpressionCapabilities,
  isUserVariable,
  UserVariable,
} from "@/model/userVariable";
import { isIdentifier } from "@/util/identifier";
import { makeStyles } from "@/util/styles";
import DoneCancel from "@/components/DoneCancel";
import ExprPartChip from "@/components/UserVariablesDialog/ExprPartChip";
import ExprPartFilterMenu from "@/components/UserVariablesDialog/ExprPartFilterMenu";
import { EditedVariable, exprPartKeys, exprPartTypesDefault } from "./utils";
import HeaderBar from "./HeaderBar";
import ExprEditor from "./ExprEditor";
import { validateExpression } from "@/api/validateExpression";
import { Tooltip } from "@mui/material";

const styles = makeStyles({
  container: { display: "flex", flexDirection: "column", height: "100%" },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: 1,
  },
  propertiesRow: { display: "flex", gap: 1 },
  expressionRow: { flexGrow: 1 },
  expressionParts: { paddingTop: 1, overflowY: "auto" },
  expressionPart: { padding: 0.2 },
  expressionPartChip: { fontFamily: "monospace" },
});

// Note: for time being, we do not allow user-defined variables to be
//    part of an expression.

interface UserVariableEditorProps {
  userVariables: UserVariable[];
  setUserVariables: (userVariables: UserVariable[]) => void;
  editedVariable: EditedVariable;
  setEditedVariable: (editedVariable: EditedVariable | null) => void;
  contextDataset: Dataset;
  expressionCapabilities: ExpressionCapabilities;
  serverUrl: string;
}

export default function UserVariableEditor({
  userVariables,
  setUserVariables,
  editedVariable,
  setEditedVariable,
  contextDataset,
  expressionCapabilities,
  serverUrl,
}: UserVariableEditorProps) {
  const [exprPartTypes, setExprPartTypes] = useState(exprPartTypesDefault);
  const [exprFilterAnchorEl, setExprFilterAnchorEl] =
    useState<HTMLElement | null>(null);
  const allVariables = [...userVariables, ...contextDataset.variables];
  const datasetVariableNames = contextDataset.variables
    .filter((v) => !isUserVariable(v))
    .map((v) => v.name);
  const { id, name, title, units, expression } = editedVariable.variable;
  const isNameUsed =
    allVariables.findIndex((v) => v.id !== id && v.name === name) >= 0;
  const isNameInvalid = !isIdentifier(name);
  const nameProblem = isNameUsed
    ? i18n.get("Already in use")
    : isNameInvalid
      ? i18n.get("Not a valid identifier")
      : null;
  const isNameOk = !nameProblem;
  const [expressionProblem, setExpressionProblem] = useState<string | null>(
    null,
  );
  const isExpressionOk = !expressionProblem;
  const canCommit = isNameOk && isExpressionOk;
  const handleInsertPartRef = useRef<null | ((part: string) => void)>(null);
  useEffect(() => {
    // Debounce expression changes
    const timerId = setTimeout(() => {
      validateExpression(
        serverUrl,
        contextDataset.id,
        editedVariable.variable.expression,
      ).then(setExpressionProblem);
    }, 500); // 500ms delay
    return () => {
      clearTimeout(timerId);
    };
  }, [serverUrl, contextDataset.id, editedVariable.variable.expression]);

  const changeVariableKey = (key: keyof UserVariable, value: string) => {
    setEditedVariable({
      ...editedVariable,
      variable: { ...editedVariable.variable, [key]: value },
    });
  };

  const handleDone = () => {
    if (editedVariable.editMode === "add") {
      setUserVariables([editedVariable.variable, ...userVariables]);
    } else {
      const index = userVariables.findIndex(
        (v) => v.id === editedVariable.variable.id,
      );
      if (index >= 0) {
        const copy = [...userVariables];
        copy[index] = editedVariable.variable;
        setUserVariables(copy);
      }
    }
    setEditedVariable(null);
  };

  const handleCancel = () => {
    setEditedVariable(null);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeVariableKey("name", event.target.value);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeVariableKey("title", event.target.value);
  };

  const handleUnitsChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeVariableKey("units", event.target.value);
  };

  const handleExpressionChange = (value: string) => {
    changeVariableKey("expression", value);
  };

  const handleExpressionInsert = (part: string) => {
    handleInsertPartRef.current!(part);
  };

  const handleExprFilterMenuOpen = (ev: MouseEvent<HTMLButtonElement>) => {
    setExprFilterAnchorEl(ev.currentTarget);
  };

  const handleExprFilterMenuClose = () => {
    setExprFilterAnchorEl(null);
  };

  const exprPartChips: ReactElement[] = [
    <IconButton key="filter" size="small" onClick={handleExprFilterMenuOpen}>
      <Tooltip
        arrow
        title={i18n.get("Display further elements to be used in expressions")}
      >
        <FilterListIcon />
      </Tooltip>
    </IconButton>,
  ];
  exprPartKeys.forEach((partType) => {
    if (exprPartTypes[partType]) {
      if (partType === "variables") {
        datasetVariableNames.forEach((part) => {
          exprPartChips.push(
            <ExprPartChip
              key={`${partType}-${part}`}
              part={part}
              partType={partType}
              onPartClicked={handleExpressionInsert}
            />,
          );
        });
      } else {
        expressionCapabilities.namespace[partType].forEach((part: string) => {
          exprPartChips.push(
            <ExprPartChip
              key={`${partType}-${part}`}
              part={part}
              partType={partType}
              onPartClicked={handleExpressionInsert}
            />,
          );
        });
      }
    }
  });

  return (
    <>
      <ExprPartFilterMenu
        anchorEl={exprFilterAnchorEl}
        exprPartTypes={exprPartTypes}
        setExprPartTypes={setExprPartTypes}
        onClose={handleExprFilterMenuClose}
      />

      <HeaderBar
        selected
        title={
          editedVariable.editMode === "add"
            ? i18n.get("Add user variable")
            : i18n.get("Edit user variable")
        }
        actions={
          <DoneCancel
            size={"medium"}
            onDone={handleDone}
            doneDisabled={!canCommit}
            onCancel={handleCancel}
          />
        }
      />
      <Box sx={styles.content}>
        <Box sx={styles.propertiesRow}>
          <TextField
            sx={{ flexGrow: 0.3 }}
            error={!isNameOk}
            helperText={nameProblem}
            size="small"
            variant="standard"
            label={i18n.get("Name")}
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            sx={{ flexGrow: 0.6 }}
            size="small"
            variant="standard"
            label={i18n.get("Title")}
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            sx={{ flexGrow: 0.1 }}
            size="small"
            variant="standard"
            label={i18n.get("Units")}
            value={units}
            onChange={handleUnitsChange}
          />
        </Box>

        <Box sx={styles.expressionRow}>
          <Typography
            sx={(theme) => ({
              paddingBottom: 1,
              color: theme.palette.text.secondary,
            })}
          >
            {i18n.get("Expression")}
          </Typography>
          <ExprEditor
            expression={expression}
            onExpressionChange={handleExpressionChange}
            variableNames={datasetVariableNames}
            expressionCapabilities={expressionCapabilities}
            handleInsertPartRef={handleInsertPartRef}
          />
          {expressionProblem && (
            <Typography
              sx={{ paddingBottom: 1 }}
              color="error"
              fontSize="small"
            >
              {expressionProblem}
            </Typography>
          )}
          <Box sx={styles.expressionParts}>{exprPartChips}</Box>
        </Box>
      </Box>
    </>
  );
}
