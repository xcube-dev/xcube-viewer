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

import { useMemo, useState } from "react";
import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// import i18n from "@/i18n";
import { newId } from "@/util/id";
import { ColorBarGroup, UserColorBar } from "@/model/colorBar";
import ColorBarGroupHeader from "./ColorBarGroupHeader";
import UserColorBarEditor from "./UserColorBarEditor";

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
  colorBarGroup: ColorBarGroup;
  selectedColorBarName: string | null;
  onSelectColorBar: (colorBarName: string) => void;
  userColorBars: UserColorBar[];
  updateUserColorBars: (userColorBars: UserColorBar[]) => void;
}

export default function ColorBarSelect({
  colorBarGroup,
  selectedColorBarName,
  onSelectColorBar,
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

  const handleUserColorBarCodeChange = (userColorBar: UserColorBar) => {
    updateUserColorBars([
      ...userColorBars.slice(0, userColorBarIndex),
      { ...userColorBar },
      ...userColorBars.slice(userColorBarIndex + 1),
    ]);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ColorBarGroupHeader colorBarGroup={colorBarGroup} />
        <IconButton
          onClick={handleStartUserColorBarAdd}
          size="small"
          color="primary"
          disabled={!!editedUserColorBar.editMode}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {colorBarGroup.names.map((name) =>
        name === editedUserColorBar.editId && userColorBarIndex >= 0 ? (
          <UserColorBarEditor
            key={name}
            userColorBar={userColorBars[userColorBarIndex]}
            updateUserColorBar={handleUserColorBarCodeChange}
            onDone={handleDoneUserColorBarEdit}
            onCancel={handleCancelUserColorBarEdit}
          />
        ) : (
          <Box
            key={name}
            className={
              name === selectedColorBarName
                ? classes.colorBarGroupItemSelected
                : classes.colorBarGroupItem
            }
          >
            <Tooltip arrow title={name} placement="left">
              <img
                // src={`data:image/png;base64,${colorBars.images[name]}`}
                alt={"Color Bar"}
                width={"100%"}
                height={"100%"}
                onClick={() => onSelectColorBar(name)}
              />
            </Tooltip>
          </Box>
        ),
      )}
    </>
  );
}
