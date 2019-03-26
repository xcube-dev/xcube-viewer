import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { WithLocale } from "../util/lang";
import { I18N } from "../config";


const styles = (theme: Theme) => createStyles(
    {});

interface TimeSeriesModeSelectProps extends WithStyles<typeof styles>, WithLocale {
    timeSeriesUpdateMode: 'add' | 'replace';
    selectTimeSeriesUpdateMode: (timeSeriesUpdateMode: 'add' | 'replace') => void;
}

class TimeSeriesModeSelect extends React.Component<TimeSeriesModeSelectProps> {

    handleTimeSeriesUpdateModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.selectTimeSeriesUpdateMode(event.target.checked ? 'add' : 'replace');
    };

    render() {
        const {timeSeriesUpdateMode} = this.props;
        return (
            <FormControlLabel label={I18N.get("Multi")} control={
                <Switch
                    color={"primary"}
                    checked={timeSeriesUpdateMode === 'add'}
                    onChange={this.handleTimeSeriesUpdateModeChange}
                />
            }/>
        );
    }
}

export default withStyles(styles)(TimeSeriesModeSelect);

