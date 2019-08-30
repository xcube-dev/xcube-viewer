import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Slider, { Mark } from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";

import { TimeRange, UNIT } from '../model/timeSeries';
import { utcTimeToLocalIsoDateString } from "../util/time";

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        box: {
            marginLeft: theme.spacing(HOR_MARGIN),
            marginRight: theme.spacing(HOR_MARGIN),
            minWidth: 300,
            width: `calc(100% - ${theme.spacing(2 * (HOR_MARGIN + 1))}px)`,
        },
    }
);

interface TimeRangeSliderProps extends WithStyles<typeof styles> {
    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    updateVisibleTimeRange?: (timeRange: TimeRange | null) => void;
}

interface TimeRangeSliderState {
    selectedTimeRange?: TimeRange | null;
}

class TimeRangeSlider extends React.Component<TimeRangeSliderProps, TimeRangeSliderState> {
    state: TimeRangeSliderState;

    constructor(props: TimeRangeSliderProps) {
        super(props);
        this.state = {selectedTimeRange: this.props.selectedTimeRange};
    }

    // noinspection JSUnusedGlobalSymbols
    static getDerivedStateFromProps(nextProps: Readonly<TimeRangeSliderProps>) {
        return {selectedTimeRange: nextProps.selectedTimeRange || null};
    }

    handleChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (Array.isArray(value)) {
            this.setState({selectedTimeRange: [value[0], value[1]]});
        }
    };

    handleChangeCommitted = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (this.props.selectTimeRange && Array.isArray(value)) {
            this.props.selectTimeRange([value[0], value[1]]);
        }
    };


    render() {
        let {classes, dataTimeRange, selectedTimeRange} = this.props;

        const dataTimeRangeValid = Array.isArray(dataTimeRange);
        if (!dataTimeRangeValid) {
            dataTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
        }

        const marks: Mark[] = [
            {value: dataTimeRange![0], label: utcTimeToLocalIsoDateString(dataTimeRange![0])},
            {value: dataTimeRange![1], label: utcTimeToLocalIsoDateString(dataTimeRange![1])},
        ];

        return (
            <Box className={classes.box}>
                <Slider
                    disabled={!dataTimeRangeValid}
                    min={dataTimeRange![0]}
                    max={dataTimeRange![1]}
                    value={selectedTimeRange || undefined}
                    marks={marks}
                    onChange={this.handleChange}
                    onChangeCommitted={this.handleChangeCommitted}
                />
            </Box>
        );
    }
}

export default withStyles(styles)(TimeRangeSlider);
