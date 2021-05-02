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

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import i18n from '../i18n';

import { WithLocale } from '../util/lang';


const styles = (theme: Theme) => createStyles(
    {
        progress: {
            margin: theme.spacing(2),
        },
        message: {
            margin: theme.spacing(1),
        },
        contentContainer: {
            margin: theme.spacing(1),
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
        },
    });

interface LoadingDialogProps extends WithStyles<typeof styles>, WithLocale {
    messages: string[];
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({classes, messages}) => {

    if (messages.length === 0) {
        return null;
    }

    return (
        <Dialog open={true} aria-labelledby="loading">
            <DialogTitle id="loading">{i18n.get('Please wait...')}</DialogTitle>
            <div className={classes.contentContainer}>
                <CircularProgress className={classes.progress}/>
                {messages.map((message, i) => (
                    <Typography component="div" key={i}
                                className={classes.message}>{message}</Typography>
                ))}
            </div>
        </Dialog>
    );
};

export default withStyles(styles)(LoadingDialog);

