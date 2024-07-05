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

import { ChangeEvent, ReactElement, useState } from "react";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";

import i18n from "@/i18n";
import { Config } from "@/config";
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
import { EditedVariable, exprPartKeys, exprPartTypesDefault } from "./utils";
import HeaderBar from "./HeaderBar";
import IconButton from "@mui/material/IconButton";
import ExprPartFilterMenu from "@/components/UserVariablesDialog/ExprPartFilterMenu";

function validateExpression(expression: string): string | null {
  if (expression!.trim() === "") {
    return i18n.get("Must not be empty");
  }
  return null;
}

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
}

export default function UserVariableEditor({
  userVariables,
  setUserVariables,
  editedVariable,
  setEditedVariable,
  contextDataset,
  expressionCapabilities,
}: UserVariableEditorProps) {
  const [exprPartTypes, setExprPartTypes] = useState(exprPartTypesDefault);
  const [exprFilterAnchorEl, setExprFilterAnchorEl] =
    useState<HTMLElement | null>(null);

  const allVariables = [...userVariables, ...contextDataset.variables];

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

  const expressionProblem = validateExpression(expression);
  const isExpressionOk = !expressionProblem;

  const canCommit = isNameOk && isExpressionOk;

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
    // Here we just append the new part.
    // It would be nice, if we'd insert at current cursor position.
    // Or use the current selection to replace it according to
    // part="sin()" --> "sin(<selection>)".
    changeVariableKey(
      "expression",
      expression.length && !expression.endsWith(" ")
        ? `${expression} ${part}`
        : expression + part,
    );
  };

  const exprPartChips: ReactElement[] = [
    <>
      <IconButton
        size="small"
        onClick={(ev) => setExprFilterAnchorEl(ev.currentTarget)}
      >
        <FilterListIcon />
      </IconButton>
      <ExprPartFilterMenu
        anchorEl={exprFilterAnchorEl}
        exprPartTypes={exprPartTypes}
        setExprPartTypes={setExprPartTypes}
        onClose={() => void setExprFilterAnchorEl(null)}
      />
    </>,
  ];
  exprPartKeys.forEach((key) => {
    if (exprPartTypes[key]) {
      if (key === "variables") {
        allVariables.forEach((v) => {
          if (!isUserVariable(v)) {
            exprPartChips.push(
              <ExprPartChip
                key={`${key}-${v.name}`}
                part={v.name}
                onPartClicked={handleExpressionInsert}
              />,
            );
          }
        });
      } else {
        expressionCapabilities.namespace[key].forEach((part: string) => {
          exprPartChips.push(
            <ExprPartChip
              key={`${key}-${part}`}
              part={part}
              onPartClicked={handleExpressionInsert}
            />,
          );
        });
      }
    }
  });

  return (
    <>
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
          <CodeMirror
            theme={Config.instance.branding.themeName || "light"}
            width="100%"
            height="100px"
            extensions={[python()]}
            value={expression}
            onChange={handleExpressionChange}
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
