/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import i18n from "@/i18n";
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
        label={i18n.get("XYZ Layer URL")}
        variant="standard"
        size="small"
        value={url}
        fullWidth
        onChange={(e) => setUrl(e.currentTarget.value)}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          required
          label={i18n.get("Layer Title")}
          variant="standard"
          size="small"
          sx={{ flexGrow: 0.3 }}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <TextField
          label={i18n.get("Layer Attribution")}
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
        helpUrl={i18n.get("docs/add-layer-xyz.en.md")}
      />
    </Box>
  );
};

export default UserLayerEditorXyz;
