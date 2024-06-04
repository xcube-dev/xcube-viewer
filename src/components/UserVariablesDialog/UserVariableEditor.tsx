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

import { ChangeEvent } from "react";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import i18n from "@/i18n";
import { Config } from "@/config";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import DoneCancel from "@/components/DoneCancel";
import { EditedVariable } from "./utils";
import HeaderBar from "./HeaderBar";

// TODO: for time being, we do not allow user-defined variables to be
//    part of an expression.

interface UserVariableEditorProps {
  userVariables: Variable[];
  setUserVariables: (userVariables: Variable[]) => void;
  editedVariable: EditedVariable;
  setEditedVariable: (editedVariable: EditedVariable | null) => void;
  contextDataset: Dataset;
}

export default function UserVariableEditor({
  userVariables,
  setUserVariables,
  editedVariable,
  setEditedVariable,
  contextDataset,
}: UserVariableEditorProps) {
  const allVariables = [...userVariables, ...contextDataset.variables];

  const { id, name, title, units, expression } = editedVariable.variable;

  const nameTaken =
    allVariables.findIndex((v) => v.id !== id && v.name === name.trim()) >= 0;

  const nameOk = name.trim() !== "" && !nameTaken;
  const expressionOk = expression!.trim() !== "";

  const canCommit = nameOk && expressionOk;

  const changeVariableKey = (key: keyof Variable, value: string) => {
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

  const expressionParts = [
    "+",
    "-",
    "*",
    "/",
    "%",
    "~",
    "&",
    "|",
    "and",
    "or",
    "not",
    "()",
    "sqrt()",
    "sin()",
    "cos()",
    "tan()",
    "min()",
    "max()",
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            sx={{ flexGrow: 0.3 }}
            error={!nameOk} // TODO: !!name nameTaken
            helperText={null} // TODO: i18n.get("Name taken")
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

        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            sx={{ paddingBottom: 1 }}
            color={!expressionOk ? "error" : undefined}
          >
            Expression
          </Typography>
          <CodeMirror
            theme={Config.instance.branding.themeName || "light"}
            width="100%"
            height="100px"
            extensions={[python()]}
            value={expression}
            onChange={handleExpressionChange}
          />
          <Box sx={{ paddingTop: 1, overflowY: "auto" }}>
            {expressionParts.map((p) => (
              <Box key={p} component="span" sx={{ padding: 0.2 }}>
                <Chip
                  label={p}
                  sx={{ fontFamily: "monospace" }}
                  size="small"
                  onClick={() => handleExpressionChange(expression + " " + p)}
                />
              </Box>
            ))}
            {allVariables.map(
              (v) =>
                !v.expression && (
                  <Box key={v.id} component="span" sx={{ padding: 0.2 }}>
                    <Chip
                      label={v.name}
                      sx={{ fontFamily: "monospace" }}
                      size="small"
                      color={v.expression ? "secondary" : "primary"}
                      onClick={() =>
                        handleExpressionChange(expression + " " + v.name)
                      }
                    />
                  </Box>
                ),
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
