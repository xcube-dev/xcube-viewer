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

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import * as React from 'react';
import i18n from '../i18n';

import { PlaceGroup } from '../model/place';
import { WithLocale } from '../util/lang';
import ControlBarItem from './ControlBarItem';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        select: {
            minWidth: '5em',
        },
    });

interface PlaceGroupSelectProps extends WithStyles<typeof styles>, WithLocale {
    selectedPlaceGroupIds: string[] | null;
    placeGroups: PlaceGroup[];
    selectPlaceGroups: (placeGroupIds: string[] | null) => void;
    removeAllUserPlaces: () => void;

    selectedPlaceGroupsTitle: string;

    language?: string;
}

const PlaceGroupsSelect: React.FC<PlaceGroupSelectProps> = ({
                                                                classes,
                                                                placeGroups,
                                                                selectPlaceGroups,
                                                                selectedPlaceGroupIds,
                                                                selectedPlaceGroupsTitle,
                                                                removeAllUserPlaces,
                                                            }) => {

    const handlePlaceGroupsChange = (event: React.ChangeEvent<{ name?: string; value: any; }>) => {
        selectPlaceGroups(event.target.value as any as string[] || null);
    };

    const handleRemoveButtonClick = () => {
        removeAllUserPlaces();
    };

    const renderSelectedPlaceGroupsTitle = () => {
        return selectedPlaceGroupsTitle;
    };

    placeGroups = placeGroups || [];
    selectedPlaceGroupIds = selectedPlaceGroupIds || [];

    if (placeGroups.length === 0 || (placeGroups.length === 1 && placeGroups[0].id === 'user')) {
        return null;
    }

    const placeGroupsSelectLabel = (
        <InputLabel
            shrink
            htmlFor="place-groups-select"
        >
            {i18n.get('Places')}
        </InputLabel>
    );

    const placeGroupsSelect = (
        <Select
            multiple
            displayEmpty
            onChange={handlePlaceGroupsChange}
            input={<Input name="place-groups" id="place-groups-select"/>}
            value={selectedPlaceGroupIds}
            renderValue={renderSelectedPlaceGroupsTitle}
            name="place-groups"
            className={classes.select}
        >
            {placeGroups.map(placeGroup => (
                <MenuItem
                    key={placeGroup.id}
                    value={placeGroup.id}
                >
                    <Checkbox checked={selectedPlaceGroupIds!.indexOf(placeGroup.id) > -1}/>
                    <ListItemText primary={placeGroup.title}/>
                </MenuItem>
            ))}
        </Select>
    );

    const removeEnabled = selectedPlaceGroupIds.length === 1 && selectedPlaceGroupIds[0] === 'user';
    const placeGroupRemoveButton = (
        <IconButton disabled={!removeEnabled} onClick={handleRemoveButtonClick} size="large">
            <Tooltip arrow title={i18n.get('Remove places')}>
                {<RemoveCircleOutlineIcon/>}
            </Tooltip>
        </IconButton>
    );

    return (
        <ControlBarItem
            label={placeGroupsSelectLabel}
            control={placeGroupsSelect}
            actions={placeGroupRemoveButton}
        />
    );
};

export default withStyles(styles)(PlaceGroupsSelect);
