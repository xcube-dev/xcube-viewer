import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import { WithLocale } from '../util/lang';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginLeft: 'auto',
        },
    });

interface InfoCardSwitchProps extends WithStyles<typeof styles>, WithLocale {
    selectedDatasetId: string | null;
    infoCardOpen: boolean;
    showInfoCard: (open: boolean) => void;
}

const InfoCardSwitch: React.FC<InfoCardSwitchProps> = ({
                                                           classes,
                                                           selectedDatasetId,
                                                           infoCardOpen,
                                                           showInfoCard,
                                                       }) => {

    if (!selectedDatasetId || infoCardOpen) {
        return null;
    }

    const handleInfoButtonClick = () => {
        showInfoCard(true);
    };

    return (
        <FormControl className={classes.formControl}>
            <Box>
                <IconButton disabled={selectedDatasetId === ''} onClick={handleInfoButtonClick}>
                    {<InfoIcon/>}
                </IconButton>
            </Box>
        </FormControl>
    );
};

export default withStyles(styles)(InfoCardSwitch);
