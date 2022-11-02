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
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import {default as OlMap} from 'ol/Map';

import { AppState } from '../states/appState';
import Viewer from './Viewer';
import TimeSeriesCharts from './TimeSeriesCharts';
import InfoCard from './InfoCard';
import SplitPane from "../components/SplitPane";

const styles = (theme: Theme) => createStyles(
    {
        viewerContainer: {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        },
        chartContainer: {
            //overflowX: 'hidden',
            //overflowY: 'hidden',
        },
    });

interface WorkspaceProps extends WithStyles<typeof styles> {
    hasInfoCard: boolean;
    hasTimeseries: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    return {
        hasInfoCard: state.controlState.infoCardOpen
            && state.controlState.selectedDatasetId !== null
            && state.dataState.datasets.length > 0,
        hasTimeseries: state.dataState.timeSeriesGroups.length > 0,
    };
};

const mapDispatchToProps = {};


type Layout = "hor" | "ver";
const getLayout = (): Layout => {
    return window.innerWidth / window.innerHeight >= 1 ? "hor" : "ver";
};

const Workspace: React.FC<WorkspaceProps> = ({
                                                 classes,
                                                 hasInfoCard,
                                                 hasTimeseries
                                             }) => {
    const [map, setMap] = React.useState<OlMap | null>(null);
    const [layout, setLayout] = React.useState<Layout>(getLayout());

    React.useEffect(() =>  {
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

    if (hasInfoCard || hasTimeseries) {
        const mapPadding = 0;  // set to 20 for style debugging
        let splitPaneStyle: React.CSSProperties = {flexGrow: 1};
        let splitPaneChild1Style: React.CSSProperties = {overflow: "hidden", padding: mapPadding};
        let splitPaneChild2Style: React.CSSProperties = {overflowX: "hidden"};
        if (layout === "hor") {
            splitPaneStyle = {...splitPaneStyle, overflow: "hidden"};
            splitPaneChild1Style = {...splitPaneChild1Style, height: "100%"};
            splitPaneChild2Style = {...splitPaneChild2Style, flex: 'auto', overflowY: "auto"};
        } else {
            splitPaneStyle = {...splitPaneStyle, overflowX: "hidden", overflowY: "auto"};
            splitPaneChild1Style = {...splitPaneChild1Style, width: "100%"};
            splitPaneChild2Style = {...splitPaneChild2Style, width: '100%', overflowY: "hidden"};
        }
        return (
            <SplitPane
                dir={layout}
                initialSize={Math.max(window.innerWidth, window.innerHeight) / 2}
                onChange={handleResize}
                style={splitPaneStyle}
                child1Style={splitPaneChild1Style}
                child2Style={splitPaneChild2Style}
            >
                <Viewer onMapRef={setMap}/>
                <div className={classes.chartContainer}>
                    <InfoCard/>
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