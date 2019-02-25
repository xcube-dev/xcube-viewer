import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Time } from '../model/timeSeries';
import {
    dateTimeStringToUtcTime,
    utcTimeToLocalIsoDateTimeString
} from "../util/time";
import { I18N } from '../config';


const styles = (theme: Theme) => createStyles(
    {
        textField: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 120,
        },
    });

interface TimeSelectProps extends WithStyles<typeof styles> {
    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;
}

class TimeSelect extends React.Component<TimeSelectProps> {

    timeInputElement: HTMLInputElement | null = null;

    handleTimeInputRef = (timeInputElement: HTMLInputElement) => {
        this.timeInputElement = timeInputElement;
    };

    handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTimeString = event.target.value;
        this.props.selectTime(selectedTimeString ? dateTimeStringToUtcTime(selectedTimeString) : null);
    };

    render() {
        const {classes, selectedTime} = this.props;
        const selectedTimeString = selectedTime !== null ? utcTimeToLocalIsoDateTimeString(selectedTime) : "";
        return (
            <TextField
                inputRef={this.handleTimeInputRef}
                id="time-select"
                type="datetime-local"
                value={selectedTimeString}
                label={I18N.text`Time`}
                className={classes.textField}
                onChange={this.handleTimeChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        );
    }
}

export default withStyles(styles)(TimeSelect);

