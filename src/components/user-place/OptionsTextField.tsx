/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import TextField from "@mui/material/TextField";

import i18n from "@/i18n";

// noinspection JSUnusedLocalSymbols
const defaults = {
  parse: (text: string) => {
    return text;
  },
  format: (value: unknown): string => {
    return typeof value === "string" ? value : `${value}`;
  },
  validate: (_value: unknown): boolean => {
    return true;
  },
};

interface OptionsTextFieldProps<T, V = string> {
  options: T;
  updateOptions: (options: Partial<T>) => void;
  optionKey: keyof T;
  label: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  parse?: (text: string) => V;
  format?: (value: V) => string;
  validate?: (value: V) => boolean;
}

function OptionsTextField<T, V>() {
  return (props: OptionsTextFieldProps<T, V>): React.JSX.Element => {
    const {
      options,
      updateOptions,
      optionKey,
      label,
      style,
      className,
      disabled,
      parse,
      format,
      validate,
    } = props;
    const value: V = options[optionKey] as unknown as V;
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      const value = (parse || defaults.parse)(text) as V;
      updateOptions({ [optionKey]: value } as unknown as Partial<T>);
    };
    return (
      <TextField
        label={i18n.get(label)}
        value={(format || defaults.format)(value)}
        error={!(validate || defaults.validate)(value)}
        onChange={handleChange}
        style={style}
        className={className}
        disabled={disabled}
        size="small"
        variant="standard"
      />
    );
  };
}

export default OptionsTextField;
