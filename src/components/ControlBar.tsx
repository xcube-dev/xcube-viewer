import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles(
    {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: theme.spacing(1),
        },
    });

interface ControlBarProps extends WithStyles<typeof styles> {
}

class ControlBar extends React.Component<ControlBarProps> {

    render() {
        const {classes, children} = this.props;
        return (
            <form className={classes.root} autoComplete="off">
                {children}
            </form>
        );
    }
}

export default withStyles(styles)(ControlBar);
