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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';
import i18n from '../i18n';

import { RgbSchema } from '../model/dataset';
import { WithLocale } from '../util/lang';


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
        <Tooltip arrow title={i18n.get('Show RGB layer instead')}>
            <FormControlLabel label={i18n.get('RGB')} control={
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

