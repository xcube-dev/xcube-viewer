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
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import i18n from '../i18n';
import { Dataset } from '../model/dataset';
import { Place, PlaceGroup } from '../model/place';
import { WithLocale } from '../util/lang';
import ControlBarItem from './ControlBarItem';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        select: {
            minWidth: '5em',
        },
        button: {},
    });

interface PlaceSelectProps extends WithStyles<typeof styles>, WithLocale {
    datasets: Dataset[];
    userPlaceGroup: PlaceGroup;

    selectedPlaceGroupIds: string[] | null;
    selectedPlaceId: string | null;
    places: Place[];
    placeLabels: string[];
    selectPlace: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    renameUserPlace: (placeId: string, placeName: string) => void;
    removeUserPlace: (placeId: string, places: Place[]) => void;
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

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [editMode, setEditMode] = React.useState(false);
    const [placeName, setPlaceName] = React.useState("");
    React.useEffect(() => {
        if (editMode) {
            const index = places.findIndex(p => p.id === selectedPlaceId);
            setPlaceName(placeLabels[index]);
        }
    }, [editMode, selectedPlaceId, setPlaceName, places, placeLabels]);
    React.useEffect(() => {
        if (editMode) {
            const inputEl = inputRef.current;
            if (inputEl !== null) {
                inputEl.focus();
                inputEl.select();
            }
        }
    }, [editMode]);

    const handlePlaceChange = (event: SelectChangeEvent) => {
        selectPlace(event.target.value || null, places, true);
    };

    const handleEditButtonClick = () => {
        setEditMode(true);
    };

    const handleRemoveButtonClick = () => {
        if (selectedPlaceId !== null) {
            removeUserPlace(selectedPlaceId, places);
        }
    };

    places = places || [];
    placeLabels = placeLabels || [];
    selectedPlaceId = selectedPlaceId || '';
    selectedPlaceGroupIds = selectedPlaceGroupIds || [];

    const inputLabel = (
        <InputLabel
            shrink
            htmlFor="place-select"
        >
            {i18n.get('Place')}
        </InputLabel>
    );

    if (editMode) {
        const input = (
            <Input
                name="place"
                id="place-edit"
                value={placeName}
                error={placeName.trim().length === 0}
                inputRef={inputRef}
                onBlur={() => setEditMode(false)}
                onKeyUp={(e) => {
                    if (e.code === "Escape") {
                        setEditMode(false);
                    }  else if (e.code === "Enter") {
                        setEditMode(false);
                        renameUserPlace(selectedPlaceId!, placeName);
                    }
                }}
                onChange={(e) => {
                    setPlaceName(e.currentTarget.value);
                }}
            />
        );

        return (
            <ControlBarItem
                label={inputLabel}
                control={input}
            />
        );

    } else {
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

        const canModify = places.length > 0
            && selectedPlaceGroupIds.length === 1
            && selectedPlaceGroupIds[0] === 'user'
            && selectedPlaceId !== '';

        const editEnabled = !editMode && canModify;
        const editButton = (
            <IconButton
                className={classes.button}
                disabled={!editEnabled}
                onClick={handleEditButtonClick}
                size="large">
                <Tooltip arrow title={i18n.get('Edit place name')}>
                    {<EditIcon/>}
                </Tooltip>
            </IconButton>
        );

        const removeEnabled = !editMode && canModify;
        const removeButton = (
            <IconButton
                className={classes.button}
                disabled={!removeEnabled}
                onClick={handleRemoveButtonClick}
                size="large">
                <Tooltip arrow title={i18n.get('Remove place')}>
                    {<RemoveCircleOutlineIcon/>}
                </Tooltip>
            </IconButton>
        );

        return (
            <ControlBarItem
                label={inputLabel}
                control={select}
                actions={[editButton, removeButton]}
            />
        );
    }
};

export default withStyles(styles)(PlaceSelect);

