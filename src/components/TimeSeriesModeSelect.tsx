import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { WithLocale } from '../util/lang';
import { I18N } from '../config';


const styles = (theme: Theme) => createStyles(
    {});

interface TimeSeriesModeSelectProps extends WithStyles<typeof styles>, WithLocale {
    timeSeriesUpdateMode: 'add' | 'replace';
    selectTimeSeriesUpdateMode: (timeSeriesUpdateMode: 'add' | 'replace') => void;
}

const TimeSeriesModeSelect: React.FC<TimeSeriesModeSelectProps> = ({timeSeriesUpdateMode, selectTimeSeriesUpdateMode}) => {

    const handleTimeSeriesUpdateModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        selectTimeSeriesUpdateMode(event.target.checked ? 'add' : 'replace');
    };

    return (
        <FormControlLabel label={I18N.get('Multi')} control={
            <Switch
                color={'primary'}
                checked={timeSeriesUpdateMode === 'add'}
                onChange={handleTimeSeriesUpdateModeChange}
            />
        }/>
    );
};

export default withStyles(styles)(TimeSeriesModeSelect);

