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

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { LayerDefinition, USER_GROUP_NAME } from "@/model/layerDefinition";
import DoneCancel from "@/components/DoneCancel";

interface UserLayerEditorXyzProps {
  userLayer: LayerDefinition;
  onChange: (userLayer: LayerDefinition) => void;
  onCancel: () => void;
}

const UserLayerEditorXyz: React.FC<UserLayerEditorXyzProps> = ({
  userLayer,
  onChange,
  onCancel,
}) => {
  const [title, setTitle] = React.useState<string>(userLayer.title);
  const [url, setUrl] = React.useState<string>(userLayer.url);
  const [attribution, setAttribution] = React.useState<string>(
    userLayer.attribution || "",
  );

  const _canCommit = (title: string, url: string) => {
    const titleOk = title !== "";
    const urlOk =
      url !== "" &&
      (url.startsWith("http://") || url.trim().startsWith("https://"));
    return titleOk && urlOk;
  };

  const canCommit = () => {
    return _canCommit(title.trim(), url.trim());
  };

  const handleUserLayerChange = () =>
    onChange({
      ...userLayer,
      // TODO: I18N
      group: USER_GROUP_NAME,
      title: title.trim(),
      url: url.trim(),
      attribution: attribution.trim(),
    });

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexDirection: "column",
        padding: "5px 15px",
      }}
    >
      <TextField
        required
        label="XYZ URL"
        variant="standard"
        size="small"
        value={url}
        fullWidth
        onChange={(e) => setUrl(e.currentTarget.value)}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          required
          label="Name"
          variant="standard"
          size="small"
          sx={{ flexGrow: 0.3 }}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <TextField
          label="Attribution"
          variant="standard"
          size="small"
          sx={{ flexGrow: 0.7 }}
          value={attribution}
          onChange={(e) => setAttribution(e.currentTarget.value)}
        />
      </Box>
      <DoneCancel
        onDone={handleUserLayerChange}
        onCancel={onCancel}
        doneDisabled={!canCommit()}
        helpUrl={"docs/add-xyz-layer.en.md"}
      />
    </Box>
  );
};

export default UserLayerEditorXyz;
