import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import * as GeoJSON from 'geojson';

import { Dataset, Variable } from '../types/dataset';
import { Place } from '../types/place';

const styles = (theme: Theme) => createStyles(
    {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing.unit,
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing.unit * 2,
        },
    });

interface ControlBarProps extends WithStyles<typeof styles> {
    selectedDatasetId: string | null;
    datasets: Dataset[];
    selectDataset: (datasetId: string | null) => void;

    selectedVariableId: string | null;
    variables: Variable[];
    selectVariable: (variableId: string | null) => void;

    selectedPlaceId: string | null;
    places: Place[];
    selectPlace: (placeId: string | null) => void;

    selectedDateTime: string | null;
    selectDateTime: (dateTime: string | null) => void;
}

class ControlBar extends React.Component<ControlBarProps> {

    handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectDataset(event.target.value || null);
    };

    handleVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectVariable(event.target.value || null);
    };

    handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectPlace(event.target.value || null);
    };

    handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.selectDateTime(event.target.value || null);
    };

    render() {
        const {classes} = this.props;

        const selectedDatasetId = this.props.selectedDatasetId || '';
        const datasets = this.props.datasets || [];

        const selectedVariableId = this.props.selectedVariableId || '';
        const variables = this.props.variables || [];

        const selectedPlaceId = this.props.selectedPlaceId || '';
        const places = this.props.places || [];

        const dateTime = this.props.selectedDateTime || '';

        return (
            <form className={classes.root} autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="dataset-select">
                        Dataset
                    </InputLabel>
                    <Select
                        value={selectedDatasetId}
                        onChange={this.handleDatasetChange}
                        input={<Input name="dataset" id="dataset-select"/>}
                        displayEmpty
                        name="dataset"
                        className={classes.selectEmpty}
                    >
                        {datasets.map(dataset => <MenuItem
                            key={dataset.id}
                            value={dataset.id}
                            selected={dataset.id === selectedDatasetId}>{dataset.title}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="variable-select">
                        Variable
                    </InputLabel>
                    <Select
                        value={selectedVariableId}
                        onChange={this.handleVariableChange}
                        input={<Input name="variable" id="variable-select"/>}
                        displayEmpty
                        name="variable"
                        className={classes.selectEmpty}
                    >
                        {variables.map(variable => <MenuItem
                            key={variable.id}
                            value={variable.id}
                            selected={variable.id === selectedVariableId}>{variable.title || variable.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="place-select">
                        Place
                    </InputLabel>
                    <Select
                        value={selectedPlaceId}
                        onChange={this.handlePlaceChange}
                        input={<Input name="place" id="place-select"/>}
                        displayEmpty
                        name="place"
                        className={classes.selectEmpty}
                    >
                        {places.map(place => <MenuItem
                            key={place.id}
                            value={place.id}
                            selected={place.id === selectedPlaceId}>{ControlBar.getPlaceDisplayName(place)}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField
                    id="time-select"
                    type="datetime-local"
                    value={dateTime}
                    disabled
                    label={'Time'}
                    className={classes.formControl}
                    onChange={this.handleDateTimeChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
        );
    }

    static getPlaceDisplayName(place: GeoJSON.Feature): string {
        let properties = place.properties;
        let value = properties && (properties['title'] || properties['name'] || properties['id']) || place.id;
        if (typeof value === 'string') {
            return value;
        }
        return `${value}`;
    }
}

export default withStyles(styles)(ControlBar);
