/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useState, MouseEvent } from "react";
import { SxProps } from "@mui/system";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import i18n from "@/i18n";
import { Dataset } from "@/model/dataset";
import { Place, PlaceInfo, PlaceStyle, USER_ID_PREFIX } from "@/model/place";
import { WithLocale } from "@/util/lang";
import EditableSelect from "./EditableSelect";
import ToolButton from "./ToolButton";
import PlaceStyleEditor from "@/components/PlaceStyleEditor";

// noinspection JSUnusedLocalSymbols
const styles: Record<string, SxProps> = {
  select: {
    minWidth: "4rem",
  },
};

interface PlaceSelectProps extends WithLocale {
  datasets: Dataset[];
  selectedPlaceGroupIds: string[] | null;
  selectedPlaceId: string | null;
  selectedPlaceInfo: PlaceInfo | null;
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
  restyleUserPlace: (
    placeGroupId: string,
    placeId: string,
    placeStyle: PlaceStyle,
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
  selectedPlaceInfo,
  renameUserPlace,
  restyleUserPlace,
  removeUserPlace,
  places,
  locateSelectedPlace,
}: PlaceSelectProps) {
  const [editMode, setEditMode] = useState(false);
  const [styleAnchorEl, setStyleAnchorEl] = useState<HTMLElement | null>(null);

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

  const updatePlaceStyle = (placeStyle: PlaceStyle) => {
    restyleUserPlace(selectedPlaceGroupId!, selectedPlaceId!, placeStyle);
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

  let actions = [
    <ToolButton
      key="locatePlace"
      onClick={locateSelectedPlace}
      tooltipText={i18n.get("Locate place in map")}
      icon={<TravelExploreIcon />}
    />,
  ];

  if (!editMode && isEditableUserPlace) {
    const handleEditButtonClick = () => {
      setEditMode(true);
    };

    const handleStyleButtonClick = (event: MouseEvent<HTMLElement>) => {
      setStyleAnchorEl(event.currentTarget);
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
        key="styleButton"
        onClick={handleStyleButtonClick}
        tooltipText={i18n.get("Style place")}
        icon={<FormatColorFillIcon />}
      />,
      <ToolButton
        key="removeButton"
        onClick={handleRemoveButtonClick}
        tooltipText={i18n.get("Remove place")}
        icon={<RemoveCircleOutlineIcon />}
      />,
    ].concat(actions);
  }

  return (
    <>
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
      {selectedPlaceInfo && (
        <PlaceStyleEditor
          anchorEl={styleAnchorEl}
          setAnchorEl={setStyleAnchorEl}
          isPoint={selectedPlaceInfo.place.geometry.type === "Point"}
          placeStyle={selectedPlaceInfo}
          updatePlaceStyle={updatePlaceStyle}
        />
      )}
    </>
  );
}
