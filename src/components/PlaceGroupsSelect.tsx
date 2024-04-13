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
import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { PlaceGroup, USER_ID_PREFIX } from "@/model/place";
import EditableSelect from "./EditableSelect";
import ToolButton from "./ToolButton";

// noinspection JSUnusedLocalSymbols
const styles = (_theme: Theme) =>
  createStyles({
    select: {
      minWidth: "5em",
    },
  });

interface PlaceGroupSelectProps extends WithStyles<typeof styles>, WithLocale {
  selectedPlaceGroupIds: string[] | null;
  placeGroups: PlaceGroup[];
  selectPlaceGroups: (placeGroupIds: string[] | null) => void;
  renameUserPlaceGroup: (placeGroupId: string, newName: string) => void;
  removeUserPlaceGroup: (placeGroupId: string) => void;

  selectedPlaceGroupsTitle: string;

  language?: string;
}

const _PlaceGroupsSelect: React.FC<PlaceGroupSelectProps> = ({
  classes,
  placeGroups,
  selectPlaceGroups,
  renameUserPlaceGroup,
  removeUserPlaceGroup,
  selectedPlaceGroupIds,
  selectedPlaceGroupsTitle,
}) => {
  const [editMode, setEditMode] = React.useState(false);

  placeGroups = placeGroups || [];
  selectedPlaceGroupIds = selectedPlaceGroupIds || [];

  if (placeGroups.length === 0) {
    return null;
  }

  const selectedPlaceGroupId =
    selectedPlaceGroupIds.length === 1 ? selectedPlaceGroupIds[0] : null;

  const setPlaceGroupTitle = (placeGroupTitle: string) => {
    renameUserPlaceGroup(selectedPlaceGroupId!, placeGroupTitle);
  };

  const handlePlaceGroupsChange = (event: SelectChangeEvent<string[]>) => {
    selectPlaceGroups((event.target.value as unknown as string[]) || null);
  };

  const renderSelectedPlaceGroupsTitle = () => {
    return selectedPlaceGroupsTitle;
  };

  const select = (
    <Select
      variant="standard"
      multiple
      displayEmpty
      onChange={handlePlaceGroupsChange}
      input={<Input name="place-groups" id="place-groups-select" />}
      value={selectedPlaceGroupIds}
      renderValue={renderSelectedPlaceGroupsTitle}
      name="place-groups"
      className={classes.select}
    >
      {placeGroups.map((placeGroup) => (
        <MenuItem key={placeGroup.id} value={placeGroup.id}>
          <Checkbox
            checked={selectedPlaceGroupIds!.indexOf(placeGroup.id) > -1}
          />
          <ListItemText primary={placeGroup.title} />
        </MenuItem>
      ))}
    </Select>
  );

  let isEditableUserPlaceGroup = false;
  if (
    selectedPlaceGroupId !== null &&
    selectedPlaceGroupId.startsWith(USER_ID_PREFIX)
  ) {
    isEditableUserPlaceGroup = Boolean(
      placeGroups.find(
        (placeGroup) =>
          placeGroup.id === selectedPlaceGroupId &&
          placeGroup.features &&
          placeGroup.features.length >= 0,
      ),
    );
  }

  let actions;
  if (isEditableUserPlaceGroup) {
    const handleEditButtonClick = () => {
      setEditMode(true);
    };

    const handleRemoveButtonClick = () => {
      removeUserPlaceGroup(selectedPlaceGroupId!);
    };

    actions = [
      <ToolButton
        key="editPlaceGroup"
        onClick={handleEditButtonClick}
        tooltipText={i18n.get("Rename place group")}
        icon={<EditIcon />}
      />,
      <ToolButton
        key="removePlaceGroup"
        onClick={handleRemoveButtonClick}
        tooltipText={i18n.get("Remove places")}
        icon={<RemoveCircleOutlineIcon />}
      />,
    ];
  }

  return (
    <EditableSelect
      itemValue={selectedPlaceGroupsTitle}
      setItemValue={setPlaceGroupTitle}
      validateItemValue={(v) => v.trim().length > 0}
      editMode={editMode}
      setEditMode={setEditMode}
      labelText={i18n.get("Places")}
      select={select}
      actions={actions}
    />
  );
};

const PlaceGroupsSelect = withStyles(styles)(_PlaceGroupsSelect);
export default PlaceGroupsSelect;
