/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import i18n from "@/i18n";
import { ColorMapType } from "@/model/colorBar";
import {
  USER_COLOR_BAR_CODE_EXAMPLE,
  UserColorBar,
} from "@/model/userColorBar";
import DoneCancel from "@/components/DoneCancel";
import ColorBarItem from "./ColorBarItem";
import ColorMapTypeEditor from "./ColorMapTypeEditor";

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

  const handleTypeChange = (colorMapType: ColorMapType) => {
    updateUserColorBar({
      ...userColorBar,
      type: colorMapType,
    });
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
        setColorMapType={handleTypeChange}
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
