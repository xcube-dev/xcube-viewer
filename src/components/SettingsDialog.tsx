import React, { FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(
    {
        title: {},
        paper: {
            padding: 8,
        },
        label: {},
        value: {},
        settingsPanel: {
            marginBottom: 8,
        },
        subSettingsPanel: {
            marginTop: 8,
            marginBottom: 8,
        }
    }
);

interface SettingsDialogProps {
    open: boolean;
    scroll: 'paper' | 'body';
    closeDialog: (dialogId: string) => void;
}

export default function SettingsDialog(props: SettingsDialogProps) {
    // const classes = useStyles();

    const handleClose = () => {
        props.closeDialog('settings');
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                scroll={props.scroll}
                aria-labelledby="scroll-dialog-title"
            >
                <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
                <DialogContent>

                    <SettingsPanel title={'General'}>
                        <SettingsSubPanel label={'Player interval'} value={'500 ms'}>
                            <TextField defaultValue={'500'}/>
                        </SettingsSubPanel>
                        <SettingsSubPanel label={'Auto-open time-series chart'} value={'Off'}>
                            <Switch defaultChecked={false}/>
                        </SettingsSubPanel>
                    </SettingsPanel>

                    <SettingsPanel title={'Time-series'}>
                        <SettingsSubPanel label={'Connect points by lines'} value={'On'}>
                            <Switch defaultChecked={true}/>
                        </SettingsSubPanel>
                        <SettingsSubPanel label={'Show standard deviation (error bars)'} value={'Off'}>
                            <Switch defaultChecked={false}/>
                        </SettingsSubPanel>
                    </SettingsPanel>

                    <SettingsPanel title={'Other'}>
                        <SettingsSubPanel label={'Server'} value={'DCS4COP'}>
                        </SettingsSubPanel>
                        <SettingsSubPanel label={'Language'} value={'English'}>
                        </SettingsSubPanel>
                    </SettingsPanel>

                </DialogContent>
            </Dialog>
        </div>
    );
}

interface SettingsPanelProps {
    title: string;
}

const SettingsPanel: FunctionComponent<SettingsPanelProps> = (props) => {
    const classes = useStyles();

    const childCount = React.Children.count(props.children);

    const children: React.ReactNode[] = [];
    React.Children.forEach(props.children, (child: React.ReactNode, index: number) => {
        children.push(child);
        if (index < childCount - 1) {
            children.push(<Divider/>);
        }
    });

    return (
        <Box className={classes.settingsPanel}>
            <Typography variant='h6' className={classes.title}>
                {props.title}
            </Typography>
            <Paper className={classes.paper}>
                {children}
            </Paper>
        </Box>
    );
};

interface SettingsSubPanelProps {
    label: string;
    value?: string | number;
}

const SettingsSubPanel: FunctionComponent<SettingsSubPanelProps> = (props) => {
    const classes = useStyles();

    const labelElement = (
        <Typography variant='body1' className={classes.label}>
            {props.label}
        </Typography>
    );

    let valueElement;
    if (props.value) {
        valueElement = (
            <Typography variant='body2' color="textSecondary" className={classes.value}>
                {props.value}
            </Typography>
        );
    }

    if (props.children) {
        return (
            <Grid container className={classes.subSettingsPanel}>
                <Grid item>
                    {labelElement}
                    {valueElement}
                </Grid>
                <Grid item>
                    {props.children}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Box className={classes.subSettingsPanel}>
                {labelElement}
                {valueElement}
            </Box>
        );
    }
};