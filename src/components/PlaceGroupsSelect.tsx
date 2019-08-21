import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

import { Dataset } from '../model/dataset';
import { PlaceGroup } from '../model/place';
import { WithLocale } from "../util/lang";
import { I18N } from "../config";


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
    });

interface PlaceGroupSelectProps extends WithStyles<typeof styles>, WithLocale {
    datasets: Dataset[];

    selectedPlaceGroupIds: string[] | null;
    placeGroups: PlaceGroup[];
    selectPlaceGroups: (placeGroupIds: string[] | null, dataset: Dataset[]) => void;
    selectedPlaceGroupsTitle: string;

    language?: string;
}

class PlaceGroupsSelect extends React.Component<PlaceGroupSelectProps> {

    handlePlaceGroupsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("handlePlaceGroupsChange: ", event.target.value);
        this.props.selectPlaceGroups(event.target.value as any as string[] || null, this.props.datasets);
    };

    renderSelectedPlaceGroupsTitle = () => {
        return this.props.selectedPlaceGroupsTitle;
    };

    render() {
        const {classes} = this.props;

        const placeGroups = this.props.placeGroups || [];
        const selectedPlaceGroupIds = this.props.selectedPlaceGroupIds || [];

        if (placeGroups.length === 0) {
            return null;
        }

        return (

            <FormControl className={classes.formControl}>
                <InputLabel
                    shrink
                    htmlFor="place-groups-select"
                >
                    {I18N.get("Places")}
                </InputLabel>
                <Select
                    multiple
                    onChange={this.handlePlaceGroupsChange}
                    input={<Input name="place-groups" id="place-groups-select"/>}
                    value={selectedPlaceGroupIds}
                    renderValue={this.renderSelectedPlaceGroupsTitle}
                    name="place-groups"
                >
                    {placeGroups.map(placeGroup => (
                        <MenuItem
                            key={placeGroup.id}
                            value={placeGroup.id}
                        >
                            <Checkbox checked={selectedPlaceGroupIds.indexOf(placeGroup.id) > -1}/>
                            <ListItemText primary={placeGroup.title}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default withStyles(styles)(PlaceGroupsSelect);
