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

import { ChangeEvent, useMemo, useState } from "react";
import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// import i18n from "@/i18n";
import { newId } from "@/util/id";
import {
  ColorBar,
  ColorBars,
  formatColorBar,
  USER_COLOR_BAR_GROUP_TITLE,
  UserColorBar,
} from "@/model/colorBar";
import TextField from "@mui/material/TextField";
import DoneCancel from "@/components/DoneCancel";

const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

interface EditedUserColorBar {
  editId?: string;
  editMode?: "add" | "edit";
}

const colorBarGroupItemStyle = (theme: Theme) => ({
  marginTop: theme.spacing(COLOR_BAR_ITEM_BOX_MARGIN),
  width: 240,
  height: 20,
  borderWidth: 1,
  borderStyle: "solid",
});

const useStyles = makeStyles((theme: Theme) => ({
  colorBarGroupTitle: {
    marginTop: theme.spacing(2 * COLOR_BAR_ITEM_BOX_MARGIN),
    color: theme.palette.grey[400],
  },
  colorBarGroupItem: {
    ...colorBarGroupItemStyle(theme),
    borderColor: theme.palette.mode === "dark" ? "white" : "black",
  },
  colorBarGroupItemSelected: {
    ...colorBarGroupItemStyle(theme),
    borderColor: "orange",
  },
}));

interface ColorBarSelectProps {
  variableColorBarMinMax: [number, number];
  variableColorBarName: string;
  variableColorBar: ColorBar;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarMinMax: [number, number],
    colorBarName: string,
    opacity: number,
  ) => void;
  colorBars: ColorBars;
  userColorBars: UserColorBar[];
  updateUserColorBars: (userColorBars: UserColorBar[]) => void;
}

export default function ColorBarSelect({
  variableColorBarMinMax,
  variableColorBarName,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  colorBars,
  userColorBars,
  updateUserColorBars,
}: ColorBarSelectProps) {
  const classes = useStyles();

  const [editedUserColorBar, setEditedUserColorBar] =
    useState<EditedUserColorBar>({});

  const userColorBarIndex = useMemo(() => {
    return userColorBars.findIndex(
      (ucb) => ucb.id === editedUserColorBar.editId,
    );
  }, [userColorBars, editedUserColorBar.editId]);

  const handleColorBarNameChange = (baseName: string) => {
    variableColorBarName = formatColorBar({ ...variableColorBar, baseName });
    updateVariableColorBar(
      variableColorBarMinMax,
      variableColorBarName,
      variableOpacity,
    );
  };

  const startUserColorBarEdit = (editMode: "add" | "edit") => {
    const id = newId("user-layer-");
    updateUserColorBars([
      { id, name: id, code: "0.0: #23FF52\n0.5: red\n1.0: 120,30,255" },
      ...userColorBars,
    ]);
    setEditedUserColorBar({ editId: id, editMode });
  };

  const handleStartUserColorBarAdd = () => {
    startUserColorBarEdit("add");
  };

  // const handleStartUserColorBarEdit = () => {
  //   startUserColorBarEdit("edit");
  // };

  const handleDoneUserColorBarEdit = () => {
    setEditedUserColorBar({});
  };

  const handleCancelUserColorBarEdit = () => {
    if (editedUserColorBar.editMode === "add") {
      const [_, ...restUserColorBars] = userColorBars;
      updateUserColorBars(restUserColorBars);
    }
    setEditedUserColorBar({});
  };

  const handleUserColorBarCodeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    updateUserColorBars([
      ...userColorBars.slice(0, userColorBarIndex),
      { ...userColorBars[userColorBarIndex], code: event.currentTarget.value },
      ...userColorBars.slice(userColorBarIndex + 1),
    ]);
  };

  const canAddUserColorBar = () => {
    return true;
  };

  let key = 0;
  const entries = [];
  for (const cbg of colorBars.groups) {
    if (cbg.title === USER_COLOR_BAR_GROUP_TITLE) {
      entries.push(
        <Box
          key={key++}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip arrow title={cbg.description} placement="left">
            <Box className={classes.colorBarGroupTitle}>{cbg.title}</Box>
          </Tooltip>
          <IconButton
            onClick={handleStartUserColorBarAdd}
            size="small"
            color="primary"
            disabled={!!editedUserColorBar.editMode}
          >
            <AddIcon />
          </IconButton>
        </Box>,
      );
      for (const name of cbg.names) {
        entries.push(
          editedUserColorBar.editId === name && userColorBarIndex >= 0 ? (
            <Box>
              <Box className={classes.colorBarGroupTitle}>
                <img alt="edited color bar" width="100%" src={""} />
              </Box>
              <TextField
                label="Value to color mapping"
                placeholder="Your code goes here"
                multiline
                fullWidth
                size="small"
                minRows={3}
                sx={{ marginTop: 0.5, fontFamily: "monospace" }}
                value={userColorBars[userColorBarIndex].code}
                onChange={handleUserColorBarCodeChange}
              />
              <DoneCancel
                onDone={handleDoneUserColorBarEdit}
                onCancel={handleCancelUserColorBarEdit}
                doneDisabled={!canAddUserColorBar()}
                size="small"
              />
            </Box>
          ) : (
            <Box
              key={key++}
              className={
                name === variableColorBar.baseName
                  ? classes.colorBarGroupItemSelected
                  : classes.colorBarGroupItem
              }
            >
              <Tooltip arrow title={name} placement="left">
                <img
                  src={`data:image/png;base64,${colorBars.images[name]}`}
                  alt={"Color Bar"}
                  width={"100%"}
                  height={"100%"}
                  onClick={() => {
                    handleColorBarNameChange(name);
                  }}
                />
              </Tooltip>
            </Box>
          ),
        );
      }
    } else {
      entries.push(
        <Tooltip arrow key={key++} title={cbg.description} placement="left">
          <Box className={classes.colorBarGroupTitle}>{cbg.title}</Box>
        </Tooltip>,
      );
      for (const name of cbg.names) {
        entries.push(
          <Box
            key={key++}
            className={
              name === variableColorBar.baseName
                ? classes.colorBarGroupItemSelected
                : classes.colorBarGroupItem
            }
          >
            <Tooltip arrow title={name} placement="left">
              <img
                src={`data:image/png;base64,${colorBars.images[name]}`}
                alt={"Color Bar"}
                width={"100%"}
                height={"100%"}
                onClick={() => {
                  handleColorBarNameChange(name);
                }}
              />
            </Tooltip>
          </Box>,
        );
      }
    }
  }

  return <>{entries}</>;
}
