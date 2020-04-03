import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';

import { Dataset } from '../model/dataset';
import { Place, PlaceGroup } from '../model/place';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
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
            {I18N.get('Place')}
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
        <Tooltip arrow title={I18N.get('Remove place')}>
            <IconButton
                className={classes.button}
                disabled={!removeEnabled}
                onClick={handleRemoveButtonClick}
            >
                {<RemoveCircleOutlineIcon/>}
            </IconButton>
        </Tooltip>
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

