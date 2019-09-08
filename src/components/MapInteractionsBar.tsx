import * as React from 'react';
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import CategoryIcon from '@material-ui/icons/Category';
import FormControl from '@material-ui/core/FormControl';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { WithLocale } from '../util/lang';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { MapInteraction } from "../states/controlState";


const useStyles = makeStyles(theme => ({
        formControl: {
            marginTop: theme.spacing(1.5),
            marginRight: theme.spacing(2),
        },
    }
));

interface MapInteractionsBarProps extends WithLocale {
    mapInteraction: string;
    setMapInteraction: (interaction: string) => void;
}

export default function MapInteractionsBar({mapInteraction, setMapInteraction}: MapInteractionsBarProps) {
    const classes = useStyles();

    function handleChange(event: React.MouseEvent<HTMLElement>, value: MapInteraction | null) {
        if (value !== null) {
            setMapInteraction(value);
        } else {
            setMapInteraction('Select');
        }
    }

    return (
        <FormControl className={classes.formControl}>
            <ToggleButtonGroup size="small" value={mapInteraction} exclusive onChange={handleChange}>
                <ToggleButton key={0} value="Select">
                    <CenterFocusWeakIcon/>
                </ToggleButton>
                <ToggleButton key={1} value="Point">
                    <TripOriginIcon/>
                </ToggleButton>
                <ToggleButton key={2} value="Polygon">
                    <CategoryIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
        </FormControl>
    );
}
