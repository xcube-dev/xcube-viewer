import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';

import { I18N } from '../config';
import { WithLocale } from '../util/lang';
import Button from '@material-ui/core/Button';
//import FormControl from '@material-ui/core/FormControl';
import ButtonGroup from '@material-ui/core/ButtonGroup';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }
);

interface TimeSeriesControlProps extends WithLocale, WithStyles<typeof styles> {
    addTimeSeries: () => void;
    removeAllTimeSeries: () => void;
}

class TimeSeriesControl extends React.Component<TimeSeriesControlProps> {

    readonly handleAddTimeSeriesClicked = () => {
        this.props.addTimeSeries();
    };

    readonly handleRemoveAllTimeSeriesClicked = () => {
        this.props.removeAllTimeSeries();
    };

    render() {
        return (
            <div>
                <ButtonGroup variant="contained" color="primary">
                    <Button onClick={this.handleAddTimeSeriesClicked}>
                        <TimelineIcon/>
                        {I18N.get('Add')}
                    </Button>
                    <Button onClick={this.handleRemoveAllTimeSeriesClicked}>
                        {I18N.get('Remove All')}
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default withStyles(styles)(TimeSeriesControl);
