/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { UserVariable } from "@/model/userVariable";
import { newId } from "@/util/id";

export const USER_VARIABLES_DIALOG_ID = "userVariablesDialog";

export type EditMode = "add" | "edit";

export interface EditedVariable {
  editMode: EditMode;
  variable: UserVariable;
}

export function newUserVariable(): UserVariable {
  return {
    id: newId("user"),
    // Editable properties
    name: "",
    title: "",
    units: "",
    expression: "",
    // Can be changed in the UI
    colorBarName: "bone",
    colorBarMin: 0,
    colorBarMax: 1,
    // Never used
    shape: [],
    dims: [],
    dtype: "float64",
    timeChunkSize: null,
    attrs: {},
  };
}

export function copyUserVariable(variable: UserVariable): UserVariable {
  return {
    ...variable,
    id: newId("user"),
    // Editable properties
    name: `${variable.name}_copy`,
    title: variable.title ? `${variable.title} Copy` : "",
  };
}

export const exprPartTypesDefault = {
  variables: true,
  constants: false,
  arrayOperators: false,
  otherOperators: false,
  arrayFunctions: false,
  otherFunctions: false,
};

export type ExprPartType = keyof typeof exprPartTypesDefault;

export const exprPartKeys: ExprPartType[] = [
  "variables",
  "constants",
  "arrayOperators",
  "otherOperators",
  "arrayFunctions",
  "otherFunctions",
];

export const exprPartLabels: Record<ExprPartType, string> = {
  variables: "Variables",
  constants: "Constants",
  arrayOperators: "Array operators",
  otherOperators: "Other operators",
  arrayFunctions: "Array functions",
  otherFunctions: "Other functions",
};
