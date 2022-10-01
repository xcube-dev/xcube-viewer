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

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import VolumeIcon from '@material-ui/icons/Looks3';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React from 'react';
import i18n from '../i18n';
import { Dataset } from '../model/dataset';
import { PlaceInfo } from '../model/place';
import { Variable } from '../model/variable';
import { WithLocale } from '../util/lang';
import { VolumeRenderMode } from "../states/controlState";


const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        card: {
            maxWidth: '100%',
            marginBottom: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        info: {
            marginRight: theme.spacing(1),
        },
        close: {
            marginLeft: 'auto',
        },
        cardContent: {
            padding: 8,
        },
    }
));


interface InfoCardProps extends WithLocale {
    volumeCardOpen: boolean;
    showVolumeCard: (infoCardOpen: boolean) => void;
    volumeRenderMode: VolumeRenderMode;
    setVolumeRenderMode: (volumeRenderMode: VolumeRenderMode) => any;
    selectedDataset: Dataset | null;
    selectedVariable: Variable | null;
    selectedPlaceInfo: PlaceInfo | null;
}

const VolumeCard: React.FC<InfoCardProps> = ({
                                               volumeCardOpen,
                                               showVolumeCard,
                                               volumeRenderMode,
                                               setVolumeRenderMode,
                                               selectedDataset,
                                               selectedVariable,
                                               selectedPlaceInfo,
                                           }) => {
    const classes = useStyles();

    if (!volumeCardOpen) {
        return null;
    }

    const handleVolumeRenderModeChange = (event: React.MouseEvent<HTMLElement>,
                                           volumeRenderMode: VolumeRenderMode) => {
        setVolumeRenderMode(volumeRenderMode);
    };

    const handleVolumeCardClose = () => {
        showVolumeCard(false);
    };

    return (
        <Card className={classes.card}>
            <CardActions disableSpacing>
                <VolumeIcon fontSize={'large'} className={classes.info}/>
                <ToggleButtonGroup key={0} size="small" value={volumeRenderMode}
                                   onChange={handleVolumeRenderModeChange}>
                    <ToggleButton key={0} value="mip" disabled={volumeRenderMode !== 'mip'}>
                        <Tooltip arrow  title={i18n.get('Maximum intensity projection')}>
                            <span>MIP</span>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton key={1} value="iso" disabled={volumeRenderMode !== 'iso'}>
                        <Tooltip arrow title={i18n.get('Iso-surface extraction')}>
                            <span>ISO</span>
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
                <IconButton key={1} onClick={handleVolumeCardClose} className={classes.close}>
                    {<CloseIcon/>}
                </IconButton>
            </CardActions>
            <CardContent className={classes.cardContent}>
                <canvas style={{width: '100%', height: '680px'}}/>
            </CardContent>
        </Card>
    );
};

export default VolumeCard;
