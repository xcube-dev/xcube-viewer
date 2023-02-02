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

import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InfoIcon from '@mui/icons-material/Info';
import VolumeIcon from '@mui/icons-material/ThreeDRotation';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import { Config } from '../config';
import i18n from '../i18n';
import { TimeSeriesGroup } from '../model/timeSeries';
import { WithLocale } from '../util/lang';
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginLeft: 'auto',
        },
    });

interface ControlBarActionsProps extends WithStyles<typeof styles>, WithLocale {
    visible: boolean;
    flyToSelectedObject: () => void;
    volumeCardOpen: boolean;
    showVolumeCard: (open: boolean) => void;
    infoCardOpen: boolean;
    showInfoCard: (open: boolean) => void;
    timeSeriesGroups: TimeSeriesGroup[];
    openDialog: (dialogId: string) => void;
    allowRefresh?: boolean;
    updateResources: () => any;
    compact: boolean;
}

const ControlBarActions: React.FC<ControlBarActionsProps> = (
    {
        classes,
        visible,
        flyToSelectedObject,
        volumeCardOpen,
        showVolumeCard,
        infoCardOpen,
        showInfoCard,
        timeSeriesGroups,
        openDialog,
        allowRefresh,
        updateResources,
        compact
    }
) => {
    if (!visible) {
        return null;
    }

    const canDownload = timeSeriesGroups.length > 0;

    let downloadButton;
    if (Config.instance.branding.allowDownloads) {
        downloadButton = (
            <IconButton disabled={!canDownload} onClick={() => openDialog('export')} size="small">
                <Tooltip arrow title={i18n.get('Export data')}>
                    {<CloudDownloadIcon/>}
                </Tooltip>
            </IconButton>
        );
    }

    const flyToButton = (
        <IconButton onClick={flyToSelectedObject} size="small">
            <Tooltip arrow title={i18n.get('Show selected place in map')}>
                <MyLocationIcon/>
            </Tooltip>
        </IconButton>
    );

    /*TODO: I18N*/
    let volumeButton = Config.instance.branding.allow3D && (
            <IconButton onClick={() => showVolumeCard(true)} disabled={volumeCardOpen} size="large">
                <Tooltip arrow title={'Open volume panel (experimental!)'}>
                    {<VolumeIcon/>}
                </Tooltip>
            </IconButton>
    );

    let infoButton = (
        <IconButton onClick={() => showInfoCard(true)} disabled={infoCardOpen} size="small">
            <Tooltip arrow title={i18n.get('Open information panel')}>
                {<InfoIcon/>}
            </Tooltip>
        </IconButton>
    );


    let refreshButton;
    let settingsButton;

    if (compact) {
        if (allowRefresh) {
            refreshButton = (
                <IconButton onClick={updateResources} size="small">
                    <Tooltip arrow title={i18n.get('Refresh')}>
                        <RefreshIcon/>
                    </Tooltip>
                </IconButton>
            );
        }
        settingsButton = (
            <IconButton onClick={() => openDialog('settings')} size="small">
                <Tooltip arrow title={i18n.get('Settings')}>
                    <SettingsIcon/>
                </Tooltip>
            </IconButton>
        );
    }

    return (
        <FormControl variant="standard" className={classes.formControl}>
            <Box>
                {refreshButton}
                {downloadButton}
                {flyToButton}
                {volumeButton}
                {infoButton}
                {settingsButton}
            </Box>
        </FormControl>
    );
};

export default withStyles(styles)(ControlBarActions);


