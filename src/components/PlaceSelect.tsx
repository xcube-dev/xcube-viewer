import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { Dataset } from '../model/dataset';
import { Place, PlaceGroup } from '../model/place';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';


const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing.unit * 2,
        },
        button: {
            margin: theme.spacing.unit * 0.1,
        },
    });

interface PlaceSelectProps extends WithStyles<typeof styles>, WithLocale {
    datasets: Dataset[];
    userPlaceGroup: PlaceGroup;

    selectedPlaceGroupIds: string[] | null;
    selectedPlaceId: string | null;
    places: Place[];
    placeLabels: string[];
    selectPlace: (placeId: string | null, dataset: Dataset[], userPlaceGroup: PlaceGroup) => void;
    removeUserPlace: (placeId: string) => void;
}

class PlaceSelect extends React.Component<PlaceSelectProps> {

    handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectPlace(event.target.value || null, this.props.datasets, this.props.userPlaceGroup);
    };

    handleRemoveButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        const {removeUserPlace, selectedPlaceId} = this.props;
        if (selectedPlaceId !== null) {
            removeUserPlace(selectedPlaceId);
        }
    };

    render() {
        const {selectedPlaceGroupIds, classes} = this.props;

        const places = this.props.places || [];
        const placeLabels = this.props.placeLabels || [];
        const selectedPlaceId = this.props.selectedPlaceId || '';

        if (places.length === 0) {
            return null;
        }

        return (
            <FormControl className={classes.formControl}>
                <InputLabel
                    shrink
                    htmlFor="place-select"
                >
                    {I18N.get('Place')}
                </InputLabel>
                <Select
                    value={selectedPlaceId}
                    onChange={this.handlePlaceChange}
                    input={<Input name="place" id="place-select"/>}
                    displayEmpty
                    name="place"
                    className={classes.selectEmpty}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                className={classes.button}
                                disabled={!selectedPlaceGroupIds || selectedPlaceGroupIds[0] !== 'user'}
                                aria-label={I18N.get('Delete user place')}
                                onClick={this.handleRemoveButtonClick}
                            >
                                {<RemoveCircleIcon/>}
                            </IconButton>
                        </InputAdornment>
                    }
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
            </FormControl>
        );
    }
}

export default withStyles(styles)(PlaceSelect);

