import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';

import { WithLocale } from '../util/lang';
import Box from '@material-ui/core/Box';


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
        <FormControl className={classes.formControl}>
            <Box>
                {label}
                {control}
                {actions}
            </Box>
        </FormControl>
    );
};

export default withStyles(styles)(ControlBarItem);

