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

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import { LayerDefinition } from "@/model/layerDefinition";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { WmsLayerDefinition, fetchWmsLayers } from "@/util/wms.ts";

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
    if (wmsLayers) {
      setWmsLayerIndex(
        wmsLayers.findIndex((wmsLayer) => wmsLayer.name === userLayer.name),
      );
    } else {
      setWmsLayerIndex(-1);
    }
  }, [wmsLayers, userLayer.name]);

  const canCommit = () => {
    return wmsLayers && wmsLayers.length && wmsLayerIndex != -1;
  };

  const handleUserLayerChange = () => {
    if (wmsLayers && wmsLayerIndex !== -1) {
      onChange({
        ...userLayer,
        // TODO: I18N
        group: "User",
        name: wmsLayers[wmsLayerIndex].name,
        url: wmsUrl.trim(),
        attribution: wmsLayers[wmsLayerIndex].attribution,
        wms: true,
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
        label="WMS URL"
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
            : "WMS Layer"
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

export default UserLayerEditorWms;
