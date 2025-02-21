/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { SxProps } from "@mui/system";
import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { PlaceGroup, USER_ID_PREFIX } from "@/model/place";
import EditableSelect from "./EditableSelect";
import ToolButton from "./ToolButton";

// noinspection JSUnusedLocalSymbols
const styles: Record<string, SxProps> = {
  select: {
    minWidth: "5em",
  },
};

interface PlaceGroupSelectProps extends WithLocale {
  selectedPlaceGroupIds: string[] | null;
  placeGroups: PlaceGroup[];
  selectPlaceGroups: (placeGroupIds: string[] | null) => void;
  renameUserPlaceGroup: (placeGroupId: string, newName: string) => void;
  removeUserPlaceGroup: (placeGroupId: string) => void;

  selectedPlaceGroupsTitle: string;

  language?: string;
}

export default function PlaceGroupsSelect({
  placeGroups,
  selectPlaceGroups,
  renameUserPlaceGroup,
  removeUserPlaceGroup,
  selectedPlaceGroupIds,
  selectedPlaceGroupsTitle,
}: PlaceGroupSelectProps) {
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
      sx={styles.select}
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
}
