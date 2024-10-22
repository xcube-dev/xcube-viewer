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

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { Dataset } from "@/model/dataset";
import { ExpressionCapabilities, UserVariable } from "@/model/userVariable";
import { USER_VARIABLES_DIALOG_ID, EditedVariable } from "./utils";
import UserVariablesTable from "./UserVariablesTable";
import UserVariableEditor from "./UserVariableEditor";
import HelpButton from "@/components/HelpButton";

const styles = makeStyles({
  dialogContent: { height: 420 },
  dialogActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: 0.2,
  },
});

interface UserVariablesDialogProps {
  open: boolean;
  selectedDataset: Dataset | null;
  selectedVariableName: string | null;
  selectVariable: (variableName: string | null) => void;
  closeDialog: (dialogId: string) => void;
  userVariables: UserVariable[];
  updateDatasetUserVariables: (
    datasetId: string,
    userVariables: UserVariable[],
  ) => void;
  expressionCapabilities: ExpressionCapabilities | null;
  serverUrl: string;
  applicationTheme: string;
}

export default function UserVariablesDialog({
  open,
  closeDialog,
  selectedDataset,
  selectedVariableName,
  selectVariable,
  userVariables,
  updateDatasetUserVariables,
  expressionCapabilities,
  serverUrl,
  applicationTheme,
}: UserVariablesDialogProps) {
  const [localUserVariables, setLocalUserVariables] =
    useState<UserVariable[]>(userVariables);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    localUserVariables.findIndex((v) => v.name === selectedVariableName),
  );
  const [editedVariable, setEditedVariable] = useState<EditedVariable | null>(
    null,
  );

  useEffect(() => {
    setLocalUserVariables(userVariables);
  }, [userVariables]);

  if (!open || !selectedDataset || !expressionCapabilities) {
    return null;
  }

  function handleConfirmDialog() {
    updateDatasetUserVariables(selectedDataset!.id, localUserVariables);
    closeDialog(USER_VARIABLES_DIALOG_ID);
    if (selectedIndex >= 0) {
      selectVariable(localUserVariables[selectedIndex].name);
    }
  }

  function handleCancelDialog() {
    setLocalUserVariables(userVariables);
    closeDialog(USER_VARIABLES_DIALOG_ID);
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"md"}
      onClose={handleCancelDialog}
      scroll="body"
    >
      <DialogTitle>{i18n.get("User Variables")}</DialogTitle>
      <DialogContent dividers sx={styles.dialogContent}>
        {editedVariable === null ? (
          <UserVariablesTable
            userVariables={localUserVariables}
            setUserVariables={setLocalUserVariables}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            setEditedVariable={setEditedVariable}
          />
        ) : (
          <UserVariableEditor
            userVariables={localUserVariables}
            setUserVariables={setLocalUserVariables}
            editedVariable={editedVariable}
            setEditedVariable={setEditedVariable}
            contextDataset={selectedDataset}
            expressionCapabilities={expressionCapabilities}
            serverUrl={serverUrl}
          />
        )}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Box>
          <HelpButton
            size="medium"
            helpUrl={i18n.get("docs/user-variables.en.md")}
            applicationTheme={applicationTheme}
          />
        </Box>
        <Box>
          <Button onClick={handleCancelDialog}>{i18n.get("Cancel")}</Button>
          <Button
            onClick={handleConfirmDialog}
            disabled={
              editedVariable !== null || !areUserVariablesOk(localUserVariables)
            }
          >
            {i18n.get("OK")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function areUserVariablesOk(userVariables: UserVariable[]) {
  const names = new Set<string>();
  userVariables.forEach((v) => names.add(v.name));
  return names.size === userVariables.length;
}
