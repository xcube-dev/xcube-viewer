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
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import FormControl from '@mui/material/FormControl';

import { WithLocale } from '../util/lang';
import Box from '@mui/material/Box';


const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing(1),
        }
    }
);

interface ControlBarItemProps extends WithStyles<typeof styles>, WithLocale {
    label: React.ReactNode;
    control: React.ReactNode;
    actions?: React.ReactNode | null;
}

const ControlBarItem: React.FC<ControlBarItemProps> = ({
                                                           classes,
                                                           label,
                                                           control,
                                                           actions
                                                       }) => {
    return (
        <FormControl variant="standard" className={classes.formControl}>
            <Box>
                {label}
                {control}
                {actions}
            </Box>
        </FormControl>
    );
};

export default withStyles(styles)(ControlBarItem);

