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

import { newId } from "@/util/id";
import { UserVariable } from "@/model/userVariable";

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
