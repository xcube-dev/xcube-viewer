import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';

import { RgbSchema } from '../model/dataset';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {});

interface RgbSwitchProps extends WithStyles<typeof styles>, WithLocale {
    showRgbLayer: boolean;
    rgbSchema: RgbSchema | null;
    setRgbLayerVisibility: (showRgbLayer: boolean) => void;
}

const RgbSwitch: React.FC<RgbSwitchProps> = ({showRgbLayer, rgbSchema, setRgbLayerVisibility}) => {

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRgbLayerVisibility(event.target.checked);
    };

    return (
        <Tooltip arrow title={I18N.get('Show RGB layer instead')}>
            <FormControlLabel label={I18N.get('RGB')} control={
                <Switch
                    color={'primary'}
                    checked={rgbSchema !== null ? showRgbLayer : false}
                    disabled={rgbSchema === null}
                    onChange={handleSwitchChange}
                />
            }/>
        </Tooltip>
    );
};

export default withStyles(styles)(RgbSwitch);

