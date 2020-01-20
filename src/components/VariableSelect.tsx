import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import TimelineIcon from '@material-ui/icons/Timeline';

import { Variable } from '../model/variable';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import ControlBarItem from './ControlBarItem';


const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {},
        button: {
            margin: theme.spacing(0.1),
        },
    });

interface VariableSelectProps extends WithStyles<typeof styles>, WithLocale {
    selectedVariableName: string | null;
    canAddTimeSeries: boolean;
    variables: Variable[];
    selectVariable: (variableName: string | null) => void;
    addTimeSeries: () => void;
}

const VariableSelect: React.FC<VariableSelectProps> = ({
                                                           classes,
                                                           canAddTimeSeries,
                                                           selectedVariableName,
                                                           variables,
                                                           selectVariable,
                                                           addTimeSeries
                                                       }) => {

    const handleVariableChange = (event: React.ChangeEvent<{ name?: string; value: any; }>) => {
        selectVariable(event.target.value || null);
    };

    const handleAddTimeSeriesButtonClick = () => {
        addTimeSeries();
    };


    selectedVariableName = selectedVariableName || '';
    variables = variables || [];

    const variableSelectLabel = (
        <InputLabel shrink htmlFor="variable-select">
            {I18N.get('Variable')}
        </InputLabel>
    );

    const variableSelect = (
        <Select
            className={classes.selectEmpty}
            value={selectedVariableName}
            onChange={handleVariableChange}
            input={<Input name="variable" id="variable-select"/>}
            displayEmpty
            name="variable"
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
    );
    const timeSeriesButton = (
        <IconButton
            className={classes.button}
            disabled={!canAddTimeSeries}
            onClick={handleAddTimeSeriesButtonClick}
        >
            {<TimelineIcon/>}
        </IconButton>
    );

    return (
        <ControlBarItem
            label={variableSelectLabel}
            control={variableSelect}
            actions={timeSeriesButton}
        />
    );
};

export default withStyles(styles)(VariableSelect);

