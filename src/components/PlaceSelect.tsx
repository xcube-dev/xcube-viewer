/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import * as React from 'react';
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
    removeUserPlace: (placeId: string, places: Place[]) => void;
}

const PlaceSelect: React.FC<PlaceSelectProps> = ({
                                                     classes,
                                                     selectPlace,
                                                     placeLabels,
                                                     selectedPlaceId,
                                                     selectedPlaceGroupIds,
                                                     removeUserPlace,
                                                     places,
                                                 }) => {

    const handlePlaceChange = (event: React.ChangeEvent<{ name?: string; value: any; }>) => {
        selectPlace(event.target.value || null, places, true);
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

    if (places.length === 0) {
        return null;
    }

    const placeSelectLabel = (
        <InputLabel
            shrink
            htmlFor="place-select"
        >
            {i18n.get('Place')}
        </InputLabel>
    );

    const placeSelect = (
        <Select
            value={selectedPlaceId}
            onChange={handlePlaceChange}
            input={<Input name="place" id="place-select"/>}
            displayEmpty
            name="place"
            className={classes.select}
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

    const removeEnabled = selectedPlaceGroupIds.length === 1 && selectedPlaceGroupIds[0] === 'user'
                          && selectedPlaceId !== '';
    const placeRemoveButton = (
        <IconButton
            className={classes.button}
            disabled={!removeEnabled}
            onClick={handleRemoveButtonClick}
        >
            <Tooltip arrow title={i18n.get('Remove place')}>
                {<RemoveCircleOutlineIcon/>}
            </Tooltip>
        </IconButton>
    );

    return (
        <ControlBarItem
            label={placeSelectLabel}
            control={placeSelect}
            actions={placeRemoveButton}
        />
    );
};

export default withStyles(styles)(PlaceSelect);

