/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
import { Tooltip } from "@mui/material";
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
import ExprPartChip from "@/components/UserVariablesDialog/ExprPartChip";
import ExprPartFilterMenu from "@/components/UserVariablesDialog/ExprPartFilterMenu";
import { EditedVariable, exprPartKeys, exprPartTypesDefault } from "./utils";
import HeaderBar from "./HeaderBar";
import ExprEditor from "./ExprEditor";
import { validateExpression } from "@/api/validateExpression";

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
  editedVariable: EditedVariable;
  setEditedVariable: (editedVariable: EditedVariable | null) => void;
  contextDataset: Dataset;
  expressionCapabilities: ExpressionCapabilities;
  serverUrl: string;
  canApply: boolean;
  setCanApply: (canApply: boolean) => void;
}

export default function UserVariableEditor({
  userVariables,
  editedVariable,
  setEditedVariable,
  contextDataset,
  expressionCapabilities,
  serverUrl,
  canApply,
  setCanApply,
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

  canApply = isNameOk && isExpressionOk;
  useEffect(() => {
    setCanApply(canApply);
  }, [setCanApply, canApply]);

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
