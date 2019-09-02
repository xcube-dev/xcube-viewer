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
        selectEmpty: {
        },
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

class VariableSelect extends React.Component<VariableSelectProps> {

    handleVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectVariable(event.target.value || null);
    };

    handleAddTimeSeriesButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.addTimeSeries();
    };

    render() {
        const {classes, canAddTimeSeries} = this.props;

        const selectedVariableName = this.props.selectedVariableName || '';
        const variables = this.props.variables || [];

        const variableSelectLabel = (
            <InputLabel shrink htmlFor="variable-select">
                {I18N.get('Variable')}
            </InputLabel>
        );

        const variableSelect = (
            <Select
                className={classes.selectEmpty}
                value={selectedVariableName}
                onChange={this.handleVariableChange}
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
                onClick={this.handleAddTimeSeriesButtonClick}
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
    }
}

export default withStyles(styles)(VariableSelect);

