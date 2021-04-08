/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import TimelineIcon from '@material-ui/icons/Timeline';
import Tooltip from '@material-ui/core/Tooltip';

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
            <Tooltip arrow title={I18N.get('Show time-series diagram')}>
                {<TimelineIcon/>}
            </Tooltip>
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

