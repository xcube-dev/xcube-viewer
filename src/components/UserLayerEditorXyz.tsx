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
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import { LayerDefinition } from "@/model/layerDefinition";

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
  const [name, setName] = React.useState<string>(userLayer.name);
  const [url, setUrl] = React.useState<string>(userLayer.url);
  const [attribution, setAttribution] = React.useState<string>(
    userLayer.attributions || "",
  );

  const _canCommit = (name: string, url: string) => {
    const nameOk = name !== "";
    const urlOk =
      url !== "" &&
      (url.startsWith("http://") || url.trim().startsWith("https://"));
    return nameOk && urlOk;
  };

  const canCommit = () => {
    return _canCommit(name.trim(), url.trim());
  };

  const handleUserLayerChange = () =>
    onChange({
      ...userLayer,
      // TODO: I18N
      group: "User",
      name: name.trim(),
      url: url.trim(),
      attributions: attribution.trim(),
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
        label="URL"
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
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
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
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={handleUserLayerChange}
          color="primary"
          disabled={!canCommit()}
        >
          <DoneIcon />
        </IconButton>
        <IconButton onClick={onCancel} color="primary">
          <CancelIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UserLayerEditorXyz;
