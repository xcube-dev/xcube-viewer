/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import i18n from "@/i18n";
import { LayerDefinition } from "@/model/layerDefinition";
import { WmsLayerDefinition, fetchWmsLayers } from "@/util/wms";
import DoneCancel from "@/components/DoneCancel";

interface UserLayerEditorWmsProps {
  userLayer: LayerDefinition;
  onChange: (userLayer: LayerDefinition) => void;
  onCancel: () => void;
}

const UserLayerEditorWms: React.FC<UserLayerEditorWmsProps> = ({
  userLayer,
  onChange,
  onCancel,
}) => {
  const [wmsUrl, setWmsUrl] = useState<string>(userLayer.url);
  const [wmsLayers, setWmsLayers] = useState<WmsLayerDefinition[] | null>(null);
  const [wmsLayerIndex, setWmsLayerIndex] = useState(-1);

  useEffect(() => {
    fetchWmsLayers(wmsUrl).then((wmsLayers) => {
      setWmsLayers(wmsLayers);
    });
  }, [wmsUrl]);

  useEffect(() => {
    if (wmsLayers && userLayer.wms) {
      const { layerName } = userLayer.wms;
      setWmsLayerIndex(
        wmsLayers.findIndex((wmsLayer) => wmsLayer.name === layerName),
      );
    } else {
      setWmsLayerIndex(-1);
    }
  }, [wmsLayers, userLayer.wms]);

  const canCommit = () => {
    return wmsLayers && wmsLayers.length && wmsLayerIndex != -1;
  };

  const handleUserLayerChange = () => {
    if (wmsLayers && wmsLayerIndex !== -1) {
      onChange({
        ...userLayer,
        title: wmsLayers[wmsLayerIndex].title,
        url: wmsUrl.trim(),
        attribution: wmsLayers[wmsLayerIndex].attribution,
        wms: {
          layerName: wmsLayers[wmsLayerIndex].name,
          // styleName not yet supported
        },
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: "column",
        padding: "5px 15px",
      }}
    >
      <TextField
        required
        label={i18n.get("WMS URL")}
        variant="standard"
        size="small"
        value={wmsUrl}
        fullWidth
        onChange={(e) => setWmsUrl(e.currentTarget.value)}
      />
      <Select
        disabled={!wmsLayers || !wmsLayers.length}
        variant="standard"
        onChange={(e) => setWmsLayerIndex(e.target.value as number)}
        value={wmsLayerIndex}
        size="small"
        renderValue={() =>
          wmsLayers && wmsLayers.length && wmsLayerIndex >= 0
            ? wmsLayers[wmsLayerIndex].title
            : i18n.get("WMS Layer")
        }
      >
        {(wmsLayers || []).map((wmsLayer, index) => (
          <MenuItem
            key={wmsLayer.name}
            value={index}
            selected={wmsLayerIndex === index}
          >
            <ListItemText primary={wmsLayer.title} />
          </MenuItem>
        ))}
      </Select>
      <DoneCancel
        onDone={handleUserLayerChange}
        onCancel={onCancel}
        doneDisabled={!canCommit()}
        helpUrl={i18n.get("docs/add-layer-wms.en.md")}
      />
    </Box>
  );
};

export default UserLayerEditorWms;
