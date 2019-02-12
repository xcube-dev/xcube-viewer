import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
// import FormHelperText from '@material-ui/core/FormHelperText';

import { Dataset, Variable } from "../types/dataset";
import { Location } from "../types/location";

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
    datasets: Dataset[] | null;
    selectDataset: (datasetId: string | null) => void;

    selectedVariableId: string | null;
    variables: Variable[] | null;
    selectVariable: (variableId: string | null) => void;

    selectedLocationId: string | number | null;
    locations: Location[] | null;
    selectLocation: (locationId: string | null) => void;

    dateTime: string | null;
    selectDateTime: (dateTime: string | null) => void;
}

class ControlBar extends React.Component<ControlBarProps> {

    handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectDataset(event.target.value || null);
    };

    handleVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectVariable(event.target.value || null);
    };

    handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectLocation(event.target.value || null);
    };

    handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.selectDateTime(event.target.value || null);
    };

    render() {
        const {classes} = this.props;

        const selectedDatasetId = this.props.selectedDatasetId || "";
        const datasets = this.props.datasets || [];

        const selectedVariableId = this.props.selectedVariableId || "";
        const variables = this.props.variables || [];

        const selectedLocationId = this.props.selectedLocationId || "";
        const locations = this.props.locations || [];

        const dateTime = this.props.dateTime || "";

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
                    {/*<FormHelperText>Helper text</FormHelperText>*/}
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
                            key={variable.name}
                            value={variable.name}
                            selected={variable.name === selectedVariableId}>{variable.title || variable.name}</MenuItem>)}
                    </Select>
                    {/*<FormHelperText>Helper text</FormHelperText>*/}
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="location-select">
                        Location
                    </InputLabel>
                    <Select
                        value={selectedLocationId}
                        onChange={this.handleLocationChange}
                        input={<Input name="location" id="location-select"/>}
                        displayEmpty
                        name="location"
                        className={classes.selectEmpty}
                    >
                        {locations.map(location => <MenuItem
                            key={location.feature.id}
                            value={location.feature.id}
                            selected={location.feature.id === selectedLocationId}>{ControlBar.getLocationDisplayName(location)}</MenuItem>)}
                    </Select>
                    {/*<FormHelperText>Helper text</FormHelperText>*/}
                </FormControl>
                <TextField
                    id="time-select"
                    type="datetime-local"
                    value={dateTime}
                    disabled
                    label={"Time"}
                    className={classes.formControl}
                    onChange={this.handleDateTimeChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
        );
    }

    static getLocationDisplayName(location: Location): string {
        let feature = location.feature;
        let properties = feature.properties;
        let value = properties && (properties["title"] || properties["name"] || properties["id"]) || feature.id;
        if (typeof value === "string") {
            return value;
        }
        return `${value}`;
    }
}

export default withStyles(styles)(ControlBar);
