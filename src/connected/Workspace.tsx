// noinspection JSUnusedLocalSymbols

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
import { connect } from 'react-redux';
import { Theme } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { default as OlMap } from 'ol/Map';

import { AppState } from '../states/appState';
import Viewer from './Viewer';
import TimeSeriesCharts from './TimeSeriesCharts';
import VolumeCard from './VolumeCard';
import InfoCard from './InfoCard';
import SplitPane from '../components/SplitPane';


// Adjust for debugging split pane style
const mapExtraStyle: React.CSSProperties = {padding: 0};

const styles = (theme: Theme) => createStyles(
        {

            splitPaneHor: {
                flexGrow: 1,
                overflow: 'hidden',
            },
            splitPaneVer: {
                flexGrow: 1,
                overflowX: 'hidden',
                overflowY: 'auto'
            },

            mapPaneHor: {
                height: '100%',
                overflow: 'hidden',
                ...mapExtraStyle
            },
            mapPaneVer: {
                width: '100%',
                overflow: 'hidden',
                ...mapExtraStyle
            },

            detailsPaneHor: {
                flex: 'auto',
                overflowX: 'hidden',
                overflowY: 'auto',
            },
            detailsPaneVer: {
                width: '100%',
                overflow: 'hidden',
            },

            viewerContainer: {
                overflow: 'hidden',
                width: '100%',
                height: '100%',
            },
        });

interface WorkspaceProps extends WithStyles<typeof styles> {
    hasInfoCard: boolean;
    hasVolumeCard: boolean;
    hasTimeseries: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    const hasDatasets = state.controlState.selectedDatasetId !== null
                        && state.dataState.datasets.length > 0;
    return {
        hasInfoCard: state.controlState.infoCardOpen && hasDatasets,
        hasVolumeCard: state.controlState.volumeCardOpen && hasDatasets,
        hasTimeseries: state.dataState.timeSeriesGroups.length > 0,
    };
};

const mapDispatchToProps = {};


type Layout = 'hor' | 'ver';
const getLayout = (): Layout => {
    return window.innerWidth / window.innerHeight >= 1 ? 'hor' : 'ver';
};

const Workspace: React.FC<WorkspaceProps> = ({
                                                 classes,
                                                 hasInfoCard,
                                                 hasVolumeCard,
                                                 hasTimeseries
                                             }) => {
    const [map, setMap] = React.useState<OlMap | null>(null);
    const [layout, setLayout] = React.useState<Layout>(getLayout());
    const useBeforeRender = (callback: any) => {
        const [isRun, setIsRun] = React.useState(false);

        if (!isRun) {
            callback();
            setIsRun(true);
        }
    };

    useBeforeRender(() => {
        window.addEventListener("error", (e) => {
            if (e) {
                const resizeObserverErrDiv = document.getElementById(
                    "webpack-dev-server-client-overlay-div",
                );
                const resizeObserverErr = document.getElementById(
                    "webpack-dev-server-client-overlay",
                );
                if (resizeObserverErr)
                    resizeObserverErr.className = "hide-resize-observer";
                if (resizeObserverErrDiv)
                    resizeObserverErrDiv.className = "hide-resize-observer";
            }
        });
    });
                                              
    React.useEffect(() => {
        updateLayout();
        window.onresize = updateLayout;
    }, []);

    const updateLayout = () => {
        setLayout(getLayout());
    };

    function handleResize(size: number) {
        if (map) {
            map.updateSize();
        }
    }

    if (hasInfoCard || hasVolumeCard || hasTimeseries) {
        const splitPaneClassName = layout === 'hor' ? classes.splitPaneHor : classes.splitPaneVer;
        const mapPaneClassName = layout === 'hor' ? classes.mapPaneHor : classes.mapPaneVer;
        const detailsPaneClassName = layout === 'hor' ? classes.detailsPaneHor : classes.detailsPaneVer;
        return (
                <SplitPane
                        dir={layout}
                        initialSize={Math.max(window.innerWidth, window.innerHeight) / 2}
                        onChange={handleResize}
                        className={splitPaneClassName}
                        child1ClassName={mapPaneClassName}
                        child2ClassName={detailsPaneClassName}
                >
                    <Viewer onMapRef={setMap}/>
                    <div>
                        <InfoCard/>
                        <VolumeCard/>
                        <TimeSeriesCharts/>
                    </div>
                </SplitPane>
        );
    } else {
        return (
                <div className={classes.viewerContainer}>
                    <Viewer onMapRef={setMap}/>
                </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Workspace));