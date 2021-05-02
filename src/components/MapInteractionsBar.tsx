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

import FormControl from '@material-ui/core/FormControl';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CategoryIcon from '@material-ui/icons/Category';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import * as React from 'react';
import i18n from '../i18n';
import { MapInteraction } from "../states/controlState";
import { WithLocale } from '../util/lang';


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
                    <Tooltip arrow title={i18n.get('Select a place in map')}>
                        <CenterFocusStrongIcon/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton key={1} value="Point">
                    <Tooltip arrow title={i18n.get('Add a point location in map')}>
                        <AddLocationIcon/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton key={2} value="Polygon">
                    <Tooltip arrow title={i18n.get('Draw a polygon area in map')}>
                        <CategoryIcon/>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton key={3} value="Circle">
                    <Tooltip arrow title={i18n.get('Draw a circular area in map')}>
                        <FiberManualRecordIcon/>
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </FormControl>
    );
}
