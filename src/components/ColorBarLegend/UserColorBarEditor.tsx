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

import { UserColorBar } from "@/model/colorBar";
import DoneCancel from "@/components/DoneCancel";

interface UserColorBarEditorProps {
  userColorBar: UserColorBar;
  updateUserColorBar: (userColorBar: UserColorBar) => void;
  onDone: () => void;
  onCancel: () => void;
}

export default function UserColorBarEditor({
  userColorBar,
  updateUserColorBar,
  onDone,
  onCancel,
}: UserColorBarEditorProps) {
  const isValid = () => {
    // TODO: validate code here
    return true;
  };

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateUserColorBar({ ...userColorBar, code: event.currentTarget.value });
  };

  return (
    <Box>
      <Box>
        <img alt="edited color bar" width="100%" src={""} />
      </Box>
      <TextField
        label="Mapping from value to color mapping"
        placeholder="Your code goes here"
        multiline
        fullWidth
        size="small"
        minRows={3}
        sx={{ marginTop: 0.5, fontFamily: "monospace" }}
        value={userColorBar.code}
        onChange={handleCodeChange}
      />
      <DoneCancel
        onDone={onDone}
        onCancel={onCancel}
        doneDisabled={!isValid()}
        size="small"
      />
    </Box>
  );
}
