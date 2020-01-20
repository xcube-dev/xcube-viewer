import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import { PlaceGroup } from '../model/place';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
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
            {I18N.get('Places')}
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
        <IconButton
            disabled={!removeEnabled}
            onClick={handleRemoveButtonClick}
        >
            {<RemoveCircleOutlineIcon/>}
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
