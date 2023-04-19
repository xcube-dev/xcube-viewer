/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2023 by the xcube development team and contributors.
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

import * as React from 'react';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import i18n from '../i18n';
import { Dataset } from '../model/dataset';
import { Place, PlaceGroup, USER_PLACE_GROUP_ID_PREFIX } from '../model/place';
import { WithLocale } from '../util/lang';
import EditableSelect from "./EditableSelect";
import ToolButton from "./ToolButton";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        select: {
            minWidth: '5em',
        },
    });

interface PlaceSelectProps extends WithStyles<typeof styles>, WithLocale {
    datasets: Dataset[];
    userPlaceGroup: PlaceGroup[];
    selectedPlaceGroupIds: string[] | null;
    selectedPlaceId: string | null;
    places: Place[];
    placeLabels: string[];
    selectPlace: (placeGroupId: string | null, placeId: string | null, places: Place[], showInMap: boolean) => void;
    renameUserPlace: (placeGroupId: string, placeId: string, placeName: string) => void;
    removeUserPlace: (placeGroupId: string, placeId: string, places: Place[]) => void;
    openDialog: (dialogId: string) => void;
}

const PlaceSelect: React.FC<PlaceSelectProps> = ({
                                                     classes,
                                                     selectPlace,
                                                     placeLabels,
                                                     selectedPlaceId,
                                                     selectedPlaceGroupIds,
                                                     renameUserPlace,
                                                     removeUserPlace,
                                                     places,
                                                 }) => {
    const [editMode, setEditMode] = React.useState(false);

    places = places || [];
    placeLabels = placeLabels || [];
    selectedPlaceId = selectedPlaceId || '';
    selectedPlaceGroupIds = selectedPlaceGroupIds || [];

    const selectedPlaceGroupId = selectedPlaceGroupIds!.length === 1 ? selectedPlaceGroupIds![0] : null;

    const placeIndex = places.findIndex(p => p.id === selectedPlaceId);
    const placeName = placeIndex >= 0 ? placeLabels[placeIndex] : "";

    const setPlaceName = (placeName: string) => {
        renameUserPlace(selectedPlaceGroupId!, selectedPlaceId!, placeName);
    };

    const handlePlaceChange = (event: SelectChangeEvent) => {
        selectPlace(selectedPlaceGroupId, event.target.value || null, places, true);
    };

    const select = (
        <Select
            variant="standard"
            value={selectedPlaceId}
            onChange={handlePlaceChange}
            input={<Input name="place" id="place-select"/>}
            displayEmpty
            name="place"
            className={classes.select}
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

    const isEditableUserPlace = selectedPlaceGroupId !== null
        && selectedPlaceGroupId.startsWith(USER_PLACE_GROUP_ID_PREFIX)
        && selectedPlaceId !== '';

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
                onClick={handleEditButtonClick}
                tooltipText={i18n.get('Rename place')}
                icon={<EditIcon/>}
            />,
            <ToolButton
                onClick={handleRemoveButtonClick}
                tooltipText={i18n.get('Remove place')}
                icon={<RemoveCircleOutlineIcon/>}
            />
        ];
    }

    return (
        <EditableSelect
            itemValue={placeName}
            setItemValue={setPlaceName}
            validateItemValue={v => v.trim().length > 0}
            editMode={editMode}
            setEditMode={setEditMode}
            labelText={i18n.get('Place')}
            select={select}
            actions={actions}
        />
    );
};

export default withStyles(styles)(PlaceSelect);

