import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import InfoIcon from '@material-ui/icons/Info';
import JSZip from 'jszip';

import { I18N } from '../config';
import { TimeSeriesGroup, timeSeriesGroupsToGeoJSON } from '../model/timeSeries';
import { WithLocale } from '../util/lang';

const saveAs = require('file-saver');


const DOWNLOADS_ALLOWED = process.env.REACT_APP_ALLOW_DOWNLOADS === '1'
                          || process.env.REACT_APP_ALLOW_DOWNLOADS === 'true';


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
    infoCardOpen: boolean;
    showInfoCard: (open: boolean) => void;
    timeSeriesGroups: TimeSeriesGroup[];
}

const ControlBarActions: React.FC<ControlBarActionsProps> = ({
                                                                 classes,
                                                                 visible,
                                                                 flyToSelectedObject,
                                                                 infoCardOpen,
                                                                 showInfoCard,
                                                                 timeSeriesGroups,
                                                             }) => {

    if (!visible) {
        return null;
    }

    let downloadButton;
    if (DOWNLOADS_ALLOWED) {
        const downloadPossible = timeSeriesGroups && timeSeriesGroups.length;
        downloadButton = (
            <IconButton onClick={() => downloadTimeSeries(timeSeriesGroups)} disabled={!downloadPossible}>
                <Tooltip arrow title={I18N.get('Download time-series data')}>
                    {<CloudDownloadIcon/>}
                </Tooltip>
            </IconButton>
        );
    }

    const flyToButton = (
        <IconButton onClick={flyToSelectedObject}>
            <Tooltip arrow title={I18N.get('Show selected place in map')}>
                <MyLocationIcon/>
            </Tooltip>
        </IconButton>
    );

    let infoButton = (
        <IconButton onClick={() => showInfoCard(true)} disabled={infoCardOpen}>
            <Tooltip arrow title={I18N.get('Open information panel')}>
                {<InfoIcon/>}
            </Tooltip>
        </IconButton>
    );

    return (
        <FormControl className={classes.formControl}>
            <Box>
                {downloadButton}
                {flyToButton}
                {infoButton}
            </Box>
        </FormControl>
    );
};

export default withStyles(styles)(ControlBarActions);


function downloadTimeSeries(timeSeriesGroups: TimeSeriesGroup[], saveCollection: boolean = false) {
    const featureCollection = timeSeriesGroupsToGeoJSON(timeSeriesGroups)
    const zip = new JSZip();
    if (saveCollection) {
        zip.file(`time-series.geojson`, JSON.stringify(featureCollection, null, 2))
    } else {
        for (let feature of featureCollection.features) {
            zip.file(`${feature.id}.geojson`, JSON.stringify(feature, null, 2))
        }
    }
    zip.generateAsync({type: "blob"})
       .then((content) => saveAs(content, "time-series.zip"));
}

