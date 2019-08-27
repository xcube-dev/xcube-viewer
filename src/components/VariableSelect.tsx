import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import BarChartIcon from '@material-ui/icons/BarChart';

import { Variable } from '../model/variable';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';


const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing.unit * 2,
        },
        button: {
            margin: theme.spacing.unit * 0.1,
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

        return (
            <FormControl className={classes.formControl}>
                <InputLabel shrink htmlFor="variable-select">
                    {I18N.get("Variable")}
                </InputLabel>
                <Select
                    className={classes.selectEmpty}
                    value={selectedVariableName}
                    onChange={this.handleVariableChange}
                    input={<Input name="variable" id="variable-select"/>}
                    displayEmpty
                    name="variable"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                className={classes.button}
                                disabled={!canAddTimeSeries}
                                aria-label={I18N.get('Show time-series')}
                                onClick={this.handleAddTimeSeriesButtonClick}
                            >
                                {<BarChartIcon/>}
                            </IconButton>
                        </InputAdornment>
                    }
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
        );
    }
}

export default withStyles(styles)(VariableSelect);

