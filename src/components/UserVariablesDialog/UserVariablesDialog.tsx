/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
}: UserVariablesDialogProps) {
  const [localUserVariables, setLocalUserVariables] =
    useState<UserVariable[]>(userVariables);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    localUserVariables.findIndex((v) => v.name === selectedVariableName),
  );
  const [editedVariable, setEditedVariable] = useState<EditedVariable | null>(
    null,
  );
  const [canCommit, setCanCommit] = useState<boolean>(false);

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

  function handleCancelFromEditor() {
    setEditedVariable(null);
  }

  function handleCommitFromEditor() {
    if (!editedVariable) return;

    if (editedVariable.editMode === "add") {
      setLocalUserVariables([editedVariable.variable, ...localUserVariables]);
    } else {
      const index = localUserVariables.findIndex(
        (v) => v.id === editedVariable.variable.id,
      );
      if (index >= 0) {
        const copy = [...localUserVariables];
        copy[index] = editedVariable.variable;
        setLocalUserVariables(copy);
      }
    }
    setEditedVariable(null);
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
            editedVariable={editedVariable}
            setEditedVariable={setEditedVariable}
            contextDataset={selectedDataset}
            expressionCapabilities={expressionCapabilities}
            serverUrl={serverUrl}
            canCommit={canCommit}
            setCanCommit={setCanCommit}
          />
        )}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Box>
          <HelpButton
            size="medium"
            helpUrl={i18n.get("docs/user-variables.en.md")}
          />
        </Box>
        {editedVariable !== null ? (
          <Box>
            <Button onClick={handleCancelFromEditor}>
              {i18n.get("Return")}
            </Button>
            <Button onClick={handleCommitFromEditor} disabled={!canCommit}>
              {i18n.get(editedVariable.editMode === "edit" ? "Apply" : "Add")}
            </Button>
          </Box>
        ) : (
          <Box>
            <Button onClick={handleCancelDialog}>{i18n.get("Cancel")}</Button>
            <Button
              onClick={handleConfirmDialog}
              disabled={!areUserVariablesOk(localUserVariables)}
            >
              {i18n.get("OK")}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}

function areUserVariablesOk(userVariables: UserVariable[]) {
  const names = new Set<string>();
  userVariables.forEach((v) => names.add(v.name));
  return names.size === userVariables.length;
}
