import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { WithLocale } from '../util/lang';
import { I18N } from '../config';


const useStyles = makeStyles((theme: Theme) => createStyles(
    {
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface MarkdownPageProps extends WithLocale {
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
    const [imprintText, setImprintText] = useState('');

    useEffect(() => {
        fetch(href)
            .then(response => response.text())
            .then(imprintText => setImprintText(imprintText));
    });

    const classes = useStyles();

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition as any}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {I18N.get(title)}
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.text}>
                <Markdown source={imprintText}/>
            </div>
        </Dialog>
    );
};

export default MarkdownPage;
