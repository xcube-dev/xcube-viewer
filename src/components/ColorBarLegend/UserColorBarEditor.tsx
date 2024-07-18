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
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import i18n from "@/i18n";
import {
  USER_COLOR_BAR_CODE_EXAMPLE,
  UserColorBar,
  ColorMapType,
} from "@/model/userColorBar";
import DoneCancel from "@/components/DoneCancel";
import ColorBarItem from "./ColorBarItem";
import ColorMapTypeEditor from "./ColorMapTypeEditor";
import ColorBarFixedValueRangeToggle from "@/components/ColorBarLegend/ColorBarFixedValueRangeToggle";

interface UserColorBarEditorProps {
  userColorBar: UserColorBar;
  updateUserColorBar: (userColorBar: UserColorBar) => void;
  selected: boolean;
  onSelect: () => void;
  onDone: () => void;
  onCancel: () => void;
}

export default function UserColorBarEditor({
  userColorBar,
  updateUserColorBar,
  selected,
  onSelect,
  onDone,
  onCancel,
}: UserColorBarEditorProps) {
  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateUserColorBar({ ...userColorBar, code: event.currentTarget.value });
  };

  const setColorMapType = (colorMapType: ColorMapType) => {
    updateUserColorBar({
      ...userColorBar,
      type: colorMapType,
    });
  };

  const setFixesValueRange = (fixesValueRange: boolean) => {
    updateUserColorBar({ ...userColorBar, fixesValueRange });
  };

  return (
    <Box>
      <ColorBarItem
        imageData={userColorBar.imageData}
        title={userColorBar.errorMessage}
        selected={selected}
        onSelect={onSelect}
      />
      <ColorMapTypeEditor
        colorMapType={userColorBar.type}
        setColorMapType={setColorMapType}
      />
      <ColorBarFixedValueRangeToggle
        fixesValueRange={userColorBar.fixesValueRange}
        setFixesValueRange={setFixesValueRange}
      />
      <TextField
        label="Color mapping"
        placeholder={USER_COLOR_BAR_CODE_EXAMPLE}
        multiline
        fullWidth
        size="small"
        minRows={3}
        sx={{ marginTop: 1, fontFamily: "monospace" }}
        value={userColorBar.code}
        onChange={handleCodeChange}
        color={userColorBar.errorMessage ? "error" : "primary"}
        inputProps={{ style: { fontFamily: "monospace", fontSize: 12 } }}
      />
      <DoneCancel
        onDone={onDone}
        onCancel={onCancel}
        doneDisabled={!!userColorBar.errorMessage}
        size="small"
        helpUrl={i18n.get("docs/color-mappings.en.md")}
      />
    </Box>
  );
}
