import * as React from 'react';
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
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

import { Dataset } from '../model/dataset';
import { Place, PlaceGroup } from '../model/place';
import { Variable } from '../model/variable';
import { Time } from '../model/timeSeries';
import {
    localDateTimeStringToUtcTime,
    utcTimeToLocalIsoDateTimeString
} from "../util/time";
import { I18N } from '../config';


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

    selectedPlaceGroupIds: string[] | null;
    placeGroups: PlaceGroup[];
    selectPlaceGroups: (placeGroupIds: string[] | null, dataset: Dataset[]) => void;
    selectedPlaceGroupsTitle: string;

    selectedPlaceId: string | null;
    places: Place[];
    placeLabels: string[];
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

        const selectedPlaceGroupIds = this.props.selectedPlaceGroupIds || [];
        const placeGroups = this.props.placeGroups || [];
        const selectedPlaceGroupsTitle = this.props.selectedPlaceGroupsTitle;

        const selectedPlaceId = this.props.selectedPlaceId || '';
        const places = this.props.places || [];
        const placeLabels = this.props.placeLabels || [];

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
                        {datasets.map(dataset => (
                            <MenuItem
                                key={dataset.id}
                                value={dataset.id}
                                selected={dataset.id === selectedDatasetId}
                            >
                                {dataset.title}
                            </MenuItem>
                        ))}
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
                        {variables.map(variable => (
                            <MenuItem
                                key={variable.name}
                                value={variable.name}
                                selected={variable.name === selectedVariableName}
                            >
                                {variable.title || variable.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="place-groups-select">
                        {I18N.text`Places`}
                    </InputLabel>
                    <Select
                        multiple
                        onChange={this.handlePlaceGroupsChange}
                        input={<Input name="place-groups" id="place-groups-select"/>}
                        value={selectedPlaceGroupIds}
                        renderValue={x => selectedPlaceGroupsTitle}
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

    handlePlaceGroupsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("handlePlaceGroupsChange: ", event.target.value);
        this.props.selectPlaceGroups(event.target.value as any as string[] || null, this.props.datasets);
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
}

export default withStyles(styles)(ControlBar);

