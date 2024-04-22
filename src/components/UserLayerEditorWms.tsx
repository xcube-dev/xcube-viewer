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
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { WmsCapabilities, getWmsCapabilities } from "@/util/wms.ts";
import Input from "@mui/material/Input";

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
  const wms = userLayer.wms || { layers: "" };
  const [url, setUrl] = useState<string>(userLayer.url);
  const [layers, setLayers] = useState(wms.layers);
  const [styles, setStyles] = useState(wms.styles ? wms.styles : "");
  const [format, setFormat] = useState(wms.format ? wms.format : "");
  const [wmsCapabilities, setWmsCapabilities] =
    useState<WmsCapabilities | null>(null);

  useEffect(() => {
    getWmsCapabilities(url).then(setWmsCapabilities);
  }, [url]);

  const _canCommit = (url: string, layers: string) => {
    const urlOk =
      url !== "" &&
      (url.startsWith("http://") || url.trim().startsWith("https://"));
    const layersOk = layers !== "";
    return layersOk && urlOk;
  };

  const canCommit = () => {
    return _canCommit(url.trim(), layers.trim());
  };

  const handleUserLayerChange = () =>
    onChange({
      ...userLayer,
      // TODO: I18N
      group: "User",
      name: layers.trim(),
      url: url.trim(),
      // attributions: attribution.trim(),
      wms: {
        layers,
        styles,
        format,
      },
    });

  const availableLayers = wmsCapabilities ? wmsCapabilities.layers : [];
  const availableStyles = wmsCapabilities ? wmsCapabilities.styles : [];
  const availableFormats = wmsCapabilities ? wmsCapabilities.formats : [];

  const selectedLayers = parseList(layers);
  const selectedStyles = parseList(styles);

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
        <Select
          disabled={!availableLayers.length}
          variant="standard"
          multiple
          onChange={(e) => setLayers(formatList(e.target.value as string[]))}
          value={selectedLayers}
          //className={classes.select}
          size="small"
          renderValue={() => layers}
        >
          {availableLayers.map((layerName) => (
            <MenuItem key={layerName} value={layerName}>
              <Checkbox checked={selectedLayers.indexOf(layerName) > -1} />
              <ListItemText primary={layerName} />
            </MenuItem>
          ))}
        </Select>
        <Select
          disabled={!availableStyles.length}
          variant="standard"
          multiple
          onChange={(e) => setStyles(formatList(e.target.value as string[]))}
          value={selectedStyles}
          //className={classes.select}
          size="small"
          renderValue={() => styles}
        >
          {availableStyles.map((styleName) => (
            <MenuItem key={styleName} value={styleName}>
              <Checkbox checked={selectedStyles.indexOf(styleName) > -1} />
              <ListItemText primary={styleName} />
            </MenuItem>
          ))}
        </Select>
        <Select
          disabled={!availableFormats.length}
          variant="standard"
          onChange={(e) => setFormat(e.target.value as string)}
          value={format}
          input={<Input id="layer-format" />}
          //className={classes.select}
          size="small"
        >
          {availableFormats.map((formatName) => (
            <MenuItem key={formatName} value={formatName}>
              <ListItemText primary={formatName} />
            </MenuItem>
          ))}
        </Select>
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

export default UserLayerEditorWms;

function parseList(text: string): string[] {
  const parts = text.split(":");
  return parts.length === 1 && parts[0] === "" ? [] : parts;
}

function formatList(list: string[]): string {
  return list.join(":");
}
