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
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SxProps } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import i18n from "@/i18n";
import { Dataset } from "@/model/dataset";
import { Place, USER_ID_PREFIX } from "@/model/place";
import { WithLocale } from "@/util/lang";
import EditableSelect from "./EditableSelect";
import ToolButton from "./ToolButton";

// noinspection JSUnusedLocalSymbols
const styles: Record<string, SxProps> = {
  select: {
    minWidth: "5em",
  },
};

interface PlaceSelectProps extends WithLocale {
  datasets: Dataset[];
  selectedPlaceGroupIds: string[] | null;
  selectedPlaceId: string | null;
  places: Place[];
  placeLabels: string[];
  selectPlace: (
    placeId: string | null,
    places: Place[],
    showInMap: boolean,
  ) => void;
  renameUserPlace: (
    placeGroupId: string,
    placeId: string,
    placeName: string,
  ) => void;
  removeUserPlace: (
    placeGroupId: string,
    placeId: string,
    places: Place[],
  ) => void;
  openDialog: (dialogId: string) => void;
  locateSelectedPlace: () => void;
}

export default function PlaceSelect({
  selectPlace,
  placeLabels,
  selectedPlaceId,
  selectedPlaceGroupIds,
  renameUserPlace,
  removeUserPlace,
  places,
  locateSelectedPlace,
}: PlaceSelectProps) {
  const [editMode, setEditMode] = React.useState(false);

  places = places || [];
  placeLabels = placeLabels || [];
  selectedPlaceId = selectedPlaceId || "";
  selectedPlaceGroupIds = selectedPlaceGroupIds || [];

  const selectedPlaceGroupId =
    selectedPlaceGroupIds!.length === 1 ? selectedPlaceGroupIds![0] : null;

  const placeIndex = places.findIndex((p) => p.id === selectedPlaceId);
  const placeName = placeIndex >= 0 ? placeLabels[placeIndex] : "";

  const setPlaceName = (placeName: string) => {
    renameUserPlace(selectedPlaceGroupId!, selectedPlaceId!, placeName);
  };

  const handlePlaceChange = (event: SelectChangeEvent) => {
    selectPlace(event.target.value || null, places, true);
  };

  const select = (
    <Select
      variant="standard"
      value={selectedPlaceId}
      onChange={handlePlaceChange}
      input={<Input name="place" id="place-select" />}
      displayEmpty
      name="place"
      sx={styles.select}
      disabled={places.length === 0}
    >
      {places.map((place, i) => (
        <MenuItem
          key={place.id}
          value={place.id}
          selected={place.id === selectedPlaceId}
        >
          {placeLabels[i]}
        </MenuItem>
      ))}
    </Select>
  );

  const isEditableUserPlace =
    selectedPlaceGroupId !== null &&
    selectedPlaceGroupId.startsWith(USER_ID_PREFIX) &&
    selectedPlaceId !== "";

  let actions;
  if (!editMode && isEditableUserPlace) {
    const handleEditButtonClick = () => {
      setEditMode(true);
    };

    const handleRemoveButtonClick = () => {
      removeUserPlace(selectedPlaceGroupId!, selectedPlaceId!, places);
    };

    actions = [
      <ToolButton
        key="editButton"
        onClick={handleEditButtonClick}
        tooltipText={i18n.get("Rename place")}
        icon={<EditIcon />}
      />,
      <ToolButton
        key="removeButton"
        onClick={handleRemoveButtonClick}
        tooltipText={i18n.get("Remove place")}
        icon={<RemoveCircleOutlineIcon />}
      />,
      <ToolButton
        key="locatePlace"
        onClick={locateSelectedPlace}
        tooltipText={i18n.get("Locate place in map")}
        icon={<TravelExploreIcon />}
      />,
    ];
  }

  return (
    <EditableSelect
      itemValue={placeName}
      setItemValue={setPlaceName}
      validateItemValue={(v) => v.trim().length > 0}
      editMode={editMode}
      setEditMode={setEditMode}
      labelText={i18n.get("Place")}
      select={select}
      actions={actions}
    />
  );
}
