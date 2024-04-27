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
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { newId } from "@/util/id";
import { ColorBarGroup, UserColorBar } from "@/model/colorBar";
import ColorBarGroupHeader from "./ColorBarGroupHeader";
import UserColorBarEditor from "./UserColorBarEditor";
import UserColorBarItem from "./UserColorBarItem";
import useUndo from "./useUndo";

interface EditMode {
  action?: "add" | "edit";
  colorBarId?: string;
}

interface UserColorBarGroupProps {
  colorBarGroup: ColorBarGroup;
  selectedColorBarName: string | null;
  onSelectColorBar: (colorBarName: string) => void;
  userColorBars: UserColorBar[];
  addUserColorBar: (userColorBarId: string) => void;
  removeUserColorBar: (userColorBarId: string) => void;
  updateUserColorBar: (userColorBar: UserColorBar) => void;
  updateUserColorBars: (userColorBars: UserColorBar[]) => void;
}

export default function ColorBarSelect({
  colorBarGroup,
  selectedColorBarName,
  onSelectColorBar,
  userColorBars,
  addUserColorBar,
  removeUserColorBar,
  updateUserColorBar,
  updateUserColorBars,
}: UserColorBarGroupProps) {
  const [editMode, setEditMode] = useState<EditMode>({});
  const [undo, setUndo] = useUndo();

  const userColorBarIndex = useMemo(() => {
    return userColorBars.findIndex((ucb) => ucb.id === editMode.colorBarId);
  }, [userColorBars, editMode.colorBarId]);

  const handleStartUserColorBarAdd = () => {
    setUndo(() => updateUserColorBars(userColorBars));
    const colorBarId = newId("user-cb-");
    addUserColorBar(colorBarId);
    setEditMode({ action: "add", colorBarId });
  };

  const handleStartUserColorBarEdit = (colorBarId: string) => {
    setUndo(() => updateUserColorBars(userColorBars));
    setEditMode({ action: "edit", colorBarId });
  };

  const handleRemoveUserColorBar = (colorBarId: string) => {
    setUndo(undefined);
    removeUserColorBar(colorBarId);
  };

  const handleDoneUserColorBarEdit = () => {
    setUndo(undefined);
    setEditMode({});
  };

  const handleCancelUserColorBarEdit = () => {
    undo();
    setEditMode({});
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
        <ColorBarGroupHeader
          title={colorBarGroup.title}
          description={colorBarGroup.description}
        />
        <IconButton
          onClick={handleStartUserColorBarAdd}
          size="small"
          color="primary"
          disabled={!!editMode.action}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Box>
      {userColorBars.map((userColorBar) =>
        userColorBar.id === editMode.colorBarId && userColorBarIndex >= 0 ? (
          <UserColorBarEditor
            key={userColorBar.id}
            userColorBar={userColorBar}
            updateUserColorBar={updateUserColorBar}
            onDone={handleDoneUserColorBarEdit}
            onCancel={handleCancelUserColorBarEdit}
          />
        ) : (
          <UserColorBarItem
            key={userColorBar.id}
            colorBarCode={userColorBar.code}
            disabled={!!editMode.action}
            selected={userColorBar.id === selectedColorBarName}
            onSelect={() => onSelectColorBar(userColorBar.id)}
            onEdit={() => handleStartUserColorBarEdit(userColorBar.id)}
            onRemove={() => handleRemoveUserColorBar(userColorBar.id)}
          />
        ),
      )}
    </>
  );
}
