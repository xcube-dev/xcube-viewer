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

import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CodeMirror from "@uiw/react-codemirror";
import { Extension } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { styled } from "@mui/system";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { FileUpload } from "./FileUpload";
import {
  ControlState,
  MapInteraction,
  UserPlacesFormatName,
  UserPlacesFormatOptions,
} from "@/states/controlState";
import GeoJsonOptionsEditor from "./user-place/GeoJsonOptionsEditor";
import CsvOptionsEditor from "./user-place/CsvOptionsEditor";
import WktOptionsEditor from "./user-place/WktOptionsEditor";
import { csvFormat, CsvOptions } from "@/model/user-place/csv";
import { geoJsonFormat, GeoJsonOptions } from "@/model/user-place/geojson";
import { wktFormat, WktOptions } from "@/model/user-place/wkt";
import { detectFormatName, Format } from "@/model/user-place/common";
import { makeStyles } from "@/util/styles";
import { useThemeContext } from "@/connected/App";
import { useTheme } from "@mui/material";

interface FormatWithCodeExt extends Format {
  codeExt: Extension[];
}

const formats: { [k: string]: FormatWithCodeExt } = {
  csv: { ...csvFormat, codeExt: [] },
  geojson: { ...geoJsonFormat, codeExt: [json()] },
  wkt: { ...wktFormat, codeExt: [] },
};

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  spacer: {
    flexGrow: 1.0,
  },
  actionButton: (theme) => ({
    marginRight: theme.spacing(1),
  }),
  error: {
    fontSize: "small",
  },
});

const StyledActionBox = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

const StyledFileUpload = styled(FileUpload)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

interface UserPlacesDialogProps extends WithLocale {
  open: boolean;
  closeDialog: (dialogId: string) => void;
  userPlacesFormatName: UserPlacesFormatName;
  userPlacesFormatOptions: UserPlacesFormatOptions;
  updateSettings: (settings: Partial<ControlState>) => void;
  addUserPlacesFromText: (userPlacesText: string) => void;
  nextMapInteraction: MapInteraction;
  setMapInteraction: (mapInteraction: MapInteraction) => void;
}

const UserPlacesDialog: React.FC<UserPlacesDialogProps> = ({
  open,
  closeDialog,
  userPlacesFormatName,
  userPlacesFormatOptions,
  updateSettings,
  addUserPlacesFromText,
  nextMapInteraction,
  setMapInteraction,
}) => {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [_userPlacesFormatName, setUserPlacesFormatName] =
    React.useState(userPlacesFormatName);
  const [_userPlacesFormatOptions, setUserPlacesFormatOptions] = React.useState(
    userPlacesFormatOptions,
  );

  const themeMode = useTheme();
  // const resolvedTheme =
  //   themeMode === "system"
  //     ? window.matchMedia("(prefers-color-scheme: dark)").matches
  //       ? "dark"
  //       : "light"
  //     : themeMode;

  React.useEffect(() => {
    setUserPlacesFormatName(userPlacesFormatName);
  }, [userPlacesFormatName]);

  React.useEffect(() => {
    setUserPlacesFormatOptions(userPlacesFormatOptions);
  }, [userPlacesFormatOptions]);

  if (!open) {
    return null;
  }

  const handleConfirm = () => {
    setMapInteraction("Select");
    closeDialog("addUserPlacesFromText");
    updateSettings({
      userPlacesFormatName: _userPlacesFormatName,
      userPlacesFormatOptions: _userPlacesFormatOptions,
    });
    addUserPlacesFromText(text);
  };

  const handleClose = () => {
    setMapInteraction(nextMapInteraction);
    closeDialog("addUserPlacesFromText");
  };

  const handleClearText = () => {
    setText("");
  };

  const handleFileSelect = (selection: File[]) => {
    const file = selection[0];
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const text = reader.result as string;
      setUserPlacesFormatName(detectFormatName(text));
      setText(text);
      setLoading(false);
    };
    reader.onabort = reader.onerror = () => {
      setLoading(false);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleCodeDrop = () => {
    setText("");
  };

  const handleCodePaste = () => {
    console.info("PASTE!", text);
  };

  const handleCodeChange = (value: string) => {
    let formatName = _userPlacesFormatName;
    if (text === "" && value.length > 10) {
      // Pasted some text
      formatName = detectFormatName(value);
      setUserPlacesFormatName(formatName);
    }
    setText(value);
    setError(formats[formatName].checkError(value));
  };

  function handleFormatNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserPlacesFormatName(e.target.value as UserPlacesFormatName);
  }

  function updateCsvOptions(options: Partial<CsvOptions>) {
    setUserPlacesFormatOptions({
      ..._userPlacesFormatOptions,
      csv: {
        ..._userPlacesFormatOptions.csv,
        ...options,
      },
    });
  }

  function updateGeoJsonOptions(options: Partial<GeoJsonOptions>) {
    setUserPlacesFormatOptions({
      ..._userPlacesFormatOptions,
      geojson: {
        ..._userPlacesFormatOptions.geojson,
        ...options,
      },
    });
  }

  function updateWktOptions(options: Partial<WktOptions>) {
    setUserPlacesFormatOptions({
      ..._userPlacesFormatOptions,
      wkt: {
        ..._userPlacesFormatOptions.wkt,
        ...options,
      },
    });
  }

  let formatOptionsEditor;
  if (_userPlacesFormatName === "csv") {
    formatOptionsEditor = (
      <CsvOptionsEditor
        options={_userPlacesFormatOptions.csv}
        updateOptions={updateCsvOptions}
      />
    );
  } else if (_userPlacesFormatName === "geojson") {
    formatOptionsEditor = (
      <GeoJsonOptionsEditor
        options={_userPlacesFormatOptions.geojson}
        updateOptions={updateGeoJsonOptions}
      />
    );
  } else {
    formatOptionsEditor = (
      <WktOptionsEditor
        options={_userPlacesFormatOptions.wkt}
        updateOptions={updateWktOptions}
      />
    );
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="server-dialog-title"
    >
      <DialogTitle id="server-dialog-title">
        {i18n.get("Import places")}
      </DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          row
          value={_userPlacesFormatName}
          onChange={(e) => handleFormatNameChange(e)}
        >
          <FormControlLabel
            key={"csv"}
            value={"csv"}
            label={i18n.get(csvFormat.name)}
            control={<Radio />}
          />
          <FormControlLabel
            key={"geojson"}
            value={"geojson"}
            label={i18n.get(geoJsonFormat.name)}
            control={<Radio />}
          />
          <FormControlLabel
            key={"wkt"}
            value={"wkt"}
            label={i18n.get(wktFormat.name)}
            control={<Radio />}
          />
        </RadioGroup>
        <CodeMirror
          theme={themeMode.palette.mode}
          placeholder={i18n.get("Enter text or drag & drop a text file.")}
          autoFocus
          height="400px"
          extensions={formats[_userPlacesFormatName].codeExt}
          value={text}
          onChange={handleCodeChange}
          onDrop={handleCodeDrop}
          onPaste={handleCodePaste}
          onPasteCapture={handleCodePaste}
        />
        {error && (
          <Typography color="error" sx={styles.error}>
            {error}
          </Typography>
        )}
        <StyledActionBox>
          <StyledFileUpload
            title={i18n.get("From File") + "..."}
            accept={formats[_userPlacesFormatName].fileExt}
            multiple={false}
            onSelect={handleFileSelect}
            disabled={loading}
          />
          <Button
            onClick={handleClearText}
            disabled={text.trim() === "" || loading}
            sx={styles.actionButton}
            variant="outlined"
            size="small"
          >
            {i18n.get("Clear")}
          </Button>
          <Box sx={styles.spacer} />
          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            variant="outlined"
            size="small"
          >
            {i18n.get("Options")}
          </Button>
        </StyledActionBox>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {formatOptionsEditor}
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="text">
          {i18n.get("Cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={text.trim() === "" || error !== null || loading}
          variant="text"
        >
          {i18n.get("OK")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPlacesDialog;
