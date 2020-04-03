import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CategoryIcon from '@material-ui/icons/Category';
import FormControl from '@material-ui/core/FormControl';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';

import { I18N } from '../config';
import { WithLocale } from '../util/lang';
import { MapInteraction } from "../states/controlState";


const useStyles = makeStyles(theme => ({
        formControl: {
            marginTop: theme.spacing(1.5),
            marginRight: theme.spacing(2),
        },
    }
));

interface MapInteractionsBarProps extends WithLocale {
    mapInteraction: MapInteraction;
    setMapInteraction: (interaction: MapInteraction) => void;
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
                    <Tooltip arrow title={I18N.get('Select a place in map')}>
                        <CenterFocusStrongIcon/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton key={1} value="Point">
                    <Tooltip arrow title={I18N.get('Add a point location in map')}>
                        <AddLocationIcon/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton key={2} value="Polygon">
                    <Tooltip arrow title={I18N.get('Draw a polygon area in map')}>
                        <CategoryIcon/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton key={3} value="Circle">
                    <Tooltip arrow title={I18N.get('Draw a circular area in map')}>
                        <FiberManualRecordIcon/>
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </FormControl>
    );
}
