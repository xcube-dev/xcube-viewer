import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import { WithLocale } from '../util/lang';


const styles = (theme: Theme) => createStyles(
    {}
);

interface ControlBarItemProps extends WithStyles<typeof styles>, WithLocale {
    label: React.ReactNode;
    control: React.ReactNode;
    actions?: React.ReactNode | null;
}

class ControlBarItem extends React.Component<ControlBarItemProps> {

    render() {
        const {label, control, actions} = this.props;

        if (!!actions) {
            return (
                <FormControl>
                    <Grid container>
                        <Grid item container>
                            <Grid item>
                                {label}
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item>
                                {control}
                            </Grid>
                            <Grid item>
                                {actions}
                            </Grid>
                        </Grid>
                    </Grid>
                </FormControl>
            );
        } else {
            return (
                <FormControl>
                    <Grid container>
                        <Grid item container>
                            <Grid item>
                                {label}
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item>
                                {control}
                            </Grid>
                        </Grid>
                    </Grid>
                </FormControl>
            );
        }
    }
}

export default withStyles(styles)(ControlBarItem);

