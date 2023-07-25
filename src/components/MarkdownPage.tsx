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

import { DialogContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';


const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        dialog: {
            backgroundColor: theme.palette.grey[600]
        },
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        text: {
            marginTop: theme.spacing(4),
            marginLeft: theme.spacing(40),
            marginRight: theme.spacing(40),
        }
    }
));

const Transition = React.forwardRef(
    function Transition({children}, ref) {
        return (
            <Slide direction="up" ref={ref}>
                {children as React.ReactElement<any, any>}
            </Slide>
        );
    }
);

interface MarkdownPageProps {
    title: string;
    href: string;
    open: boolean;
    onClose: () => void;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({
                                                       title,
                                                       href,
                                                       open,
                                                       onClose
                                                   }) => {
    const [markdownText, setMarkdownText] = useState('');

    useEffect(() => {
        fetch(href)
            .then(response => response.text())
            .then(text => setMarkdownText(text));
    });

    const classes = useStyles();

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition as any}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        size="large">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>{title}</Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.dialog}>
                <div className={classes.text}>
                    <Markdown children={markdownText} linkTarget="_blank"/>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MarkdownPage;
