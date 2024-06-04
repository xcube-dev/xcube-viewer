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

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";

import i18n from "@/i18n";
import { ControlState } from "@/states/controlState";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import {
  USER_VARIABLES_DIALOG_ID,
  EditedVariable,
  newUserVariable,
} from "./utils";
import UserVariablesTable from "./UserVariablesTable";
import UserVariableEditor from "./UserVariableEditor";

const MOCK_VARIABLES: Variable[] = Array.from({ length: 16 }, (_, index) => ({
  ...newUserVariable(),
  id: `user${index + 1}`,
  name: `var_${index}`,
  title: `Variable-${index}`,
  expression: `var_${index} - var_1`,
}));

interface UserVariablesDialogProps {
  open: boolean;
  selectedDataset: Dataset | null;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
}

export default function UserVariablesDialog({
  open,
  closeDialog,
  selectedDataset,
  // settings,
  // updateSettings,
}: UserVariablesDialogProps) {
  const [userVariables, setUserVariables] =
    useState<Variable[]>(MOCK_VARIABLES);
  const [editedVariable, setEditedVariable] = useState<EditedVariable | null>(
    null,
  );

  if (!open || !selectedDataset) {
    return null;
  }

  function handleCloseDialog() {
    closeDialog(USER_VARIABLES_DIALOG_ID);
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"md"}
      onClose={handleCloseDialog}
      scroll="body"
    >
      <DialogTitle>{i18n.get("User Variables")}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%", height: 400, mb: 2 }}>
          <Paper elevation={1} sx={{ width: "100%", height: "100%" }}>
            {editedVariable === null ? (
              <UserVariablesTable
                userVariables={userVariables}
                setUserVariables={setUserVariables}
                contextDataset={selectedDataset}
                setEditedVariable={setEditedVariable}
              />
            ) : (
              <UserVariableEditor
                userVariables={userVariables}
                setUserVariables={setUserVariables}
                editedVariable={editedVariable}
                setEditedVariable={setEditedVariable}
                contextDataset={selectedDataset}
              />
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={editedVariable !== null}>
          {i18n.get("OK")}
        </Button>
        <Button onClick={handleCloseDialog} disabled={editedVariable !== null}>
          {i18n.get("Cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
