/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import ControlBarItem from "./ControlBarItem";

interface EditableSelectProps {
  itemValue: string;
  setItemValue: (itemValue: string) => void;
  validateItemValue?: (itemValue: string) => boolean;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  labelText: string;
  select: React.ReactNode;
  actions?: React.ReactNode;
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  itemValue,
  setItemValue,
  validateItemValue,
  editMode,
  setEditMode,
  labelText,
  select,
  actions,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [interimValue, setInterimValue] = React.useState("");

  React.useEffect(() => {
    if (editMode) {
      setInterimValue(itemValue);
    }
  }, [editMode, itemValue, setInterimValue]);

  React.useEffect(() => {
    if (editMode) {
      const inputEl = inputRef.current;
      if (inputEl !== null) {
        inputEl.focus();
        inputEl.select();
      }
    }
  }, [editMode]);

  const inputLabel = (
    <InputLabel shrink htmlFor="place-select">
      {labelText}
    </InputLabel>
  );

  if (!editMode) {
    return (
      <ControlBarItem label={inputLabel} control={select} actions={actions} />
    );
  }

  const isValid = validateItemValue ? validateItemValue(interimValue) : true;

  const input = (
    <Input
      value={interimValue}
      error={!isValid}
      inputRef={inputRef}
      onBlur={() => setEditMode(false)}
      onKeyUp={(e) => {
        if (e.code === "Escape") {
          setEditMode(false);
        } else if (e.code === "Enter" && isValid) {
          setEditMode(false);
          setItemValue(interimValue);
        }
      }}
      onChange={(e) => {
        setInterimValue(e.currentTarget.value);
      }}
    />
  );

  return <ControlBarItem label={inputLabel} control={input} />;
};

export default EditableSelect;
