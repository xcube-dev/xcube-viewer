import * as React from 'react';
import * as GeoJSON from 'geojson';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { Dataset } from '../model/dataset';
import { Place } from '../model/place';
import { Variable } from '../model/variable';
import { Time } from '../model/timeSeries';
import {
    localDateTimeStringToUtcTime,
    utcTimeToLocalIsoDateTimeString
} from "../util/time";
import { I18N } from '../config/config';


const styles = (theme: Theme) => createStyles(
    {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 120,
        },
        textField: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing.unit * 2,
        },
        button: {
            margin: theme.spacing.unit * 0.3,
        },
    });

interface ControlBarProps extends WithStyles<typeof styles> {
    selectedDatasetId: string | null;
    datasets: Dataset[];
    selectDataset: (datasetId: string | null, dataset: Dataset[]) => void;

    selectedPlaceId: string | null;
    places: Place[];
    selectPlace: (placeId: string | null, dataset: Dataset[]) => void;

    selectedVariableName: string | null;
    variables: Variable[];
    selectVariable: (variableName: string | null) => void;

    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;

    timeSeriesUpdateMode: 'add' | 'replace';
    selectTimeSeriesUpdateMode: (timeSeriesUpdateMode: 'add' | 'replace') => void;
}

class ControlBar extends React.Component<ControlBarProps> {

    timeInputElement: HTMLInputElement | null;

    constructor(props: ControlBarProps) {
        super(props);
        this.timeInputElement = null;
    }

    render() {
        const {classes, timeSeriesUpdateMode} = this.props;

        const selectedDatasetId = this.props.selectedDatasetId || '';
        const datasets = this.props.datasets || [];

        const selectedVariableName = this.props.selectedVariableName || '';
        const variables = this.props.variables || [];

        const selectedPlaceId = this.props.selectedPlaceId || '';
        const places = this.props.places || [];

        const selectedTime = this.props.selectedTime !== null ? utcTimeToLocalIsoDateTimeString(this.props.selectedTime) : "";

        return (
            <form className={classes.root} autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="dataset-select">
                        {I18N.text`Dataset`}
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
                        {I18N.text`Variable`}
                    </InputLabel>
                    <Select
                        value={selectedVariableName}
                        onChange={this.handleVariableChange}
                        input={<Input name="variable" id="variable-select"/>}
                        displayEmpty
                        name="variable"
                        className={classes.selectEmpty}
                    >
                        {variables.map(variable => <MenuItem
                            key={variable.name}
                            value={variable.name}
                            selected={variable.name === selectedVariableName}>{variable.title || variable.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="place-select">
                        {I18N.text`Place`}
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
                    inputRef={this.handleTimeInputRef}
                    id="time-select"
                    type="datetime-local"
                    value={selectedTime}
                    label={I18N.text`Time`}
                    className={classes.textField}
                    onChange={this.handleTimeChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <IconButton className={classes.button} aria-label="One time step back"
                            onClick={this.handleTimeStepDown}>
                    <ArrowLeft/>
                </IconButton>
                <IconButton className={classes.button} aria-label="One time step forward"
                            onClick={this.handleTimeStepUp}>
                    <ArrowRight/>
                </IconButton>
                <FormControlLabel label={I18N.text`Multi`} control={
                    <Switch
                        color={"primary"}
                        checked={timeSeriesUpdateMode === 'add'}
                        onChange={this.handleTimeSeriesUpdateModeChange}
                    />
                }/>
            </form>
        );
    }

    handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectDataset(event.target.value || null, this.props.datasets);
    };

    handleVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectVariable(event.target.value || null);
    };

    handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectPlace(event.target.value || null, this.props.datasets);
    };

    handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.selectTime(event.target.value ? localDateTimeStringToUtcTime(event.target.value) : null);
    };

    handleTimeSeriesUpdateModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.selectTimeSeriesUpdateMode(event.target.checked ? 'add' : 'replace');
    };

    handleTimeInputRef = (timeInputElement: HTMLInputElement) => {
        this.timeInputElement = timeInputElement;
    };

    handleTimeStepUp = () => {
        let input = this.timeInputElement;
        if (input !== null) {
            input.stepUp(1);
            this.props.selectTime(input.value ? localDateTimeStringToUtcTime(input.value) : null);
        }
    };

    handleTimeStepDown = () => {
        let input = this.timeInputElement;
        if (input !== null) {
            input.stepDown(1);
            this.props.selectTime(input.value ? localDateTimeStringToUtcTime(input.value) : null);
        }
    };

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

