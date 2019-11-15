import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Slider, { Mark } from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";

const HOR_MARGIN = 5;

type ValueRange = [number, number];

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        box: {
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(HOR_MARGIN),
            marginRight: theme.spacing(HOR_MARGIN),
            minWidth: 300,
            width: `calc(100% - ${theme.spacing(2 * (HOR_MARGIN + 1))}px)`,
        },
    }
);

interface ValueRangeSliderProps extends WithStyles<typeof styles> {
    originalValueRange?: ValueRange;
    selectedValueRange?: ValueRange;
    selectValueRange?: (valueRange: ValueRange) => void;
}

interface ValueRangeSliderState {
    selectedValue?: ValueRange | null;
}

class ValueRangeSlider extends React.Component<ValueRangeSliderProps, ValueRangeSliderState> {

    handleChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (this.props.selectValueRange && Array.isArray(value)) {
            this.props.selectValueRange([value[0], value[1]]);
        }
    };

    handleChangeCommitted = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (this.props.selectValueRange && Array.isArray(value)) {
            this.props.selectValueRange([value[0], value[1]]);
        }
    };


    render() {
        let {classes, originalValueRange, selectedValueRange} = this.props;

        if (!originalValueRange) {
            originalValueRange = [0.0, 1.0];
        }

        if (!selectedValueRange) {
            selectedValueRange = originalValueRange;
        }

        const [original1, original2] = originalValueRange;
        let delta = original2 - original1;
        delta = delta > 0 ? delta : 1.0;
        const total1 = original1 - 0.5 * delta;
        const total2 = original2 + 0.5 * delta;

        const ticks = [
            total1,
            original1,
            original2,
            total2,
        ];

        const marks: Mark[] = ticks.map(value => {
            return {value, label: value.toFixed()};
        });


        return (
            <Box className={classes.box}>
                <Slider
                    min={total1}
                    max={total2}
                    value={selectedValueRange}
                    marks={marks}
                    onChange={this.handleChange}
                    onChangeCommitted={this.handleChangeCommitted}
                    valueLabelDisplay="auto"
                />
            </Box>
        );
    }
}

export default withStyles(styles)(ValueRangeSlider);
