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

import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { BBox, Position } from 'geojson';

// import i18n from '../i18n';
import { Dataset } from '../model/dataset';
import { PlaceInfo } from '../model/place';
import { Variable } from '../model/variable';
import { WithLocale } from '../util/lang';
import { VolumeRenderMode, VolumeState, VolumeStates } from '../states/controlState';
import { VolumeOptions, VolumeScene } from '../volume/VolumeScene';
import { Volume } from '../volume/Volume';
import { NRRDLoader } from '../volume/NRRDLoader';
import { ColorBar } from '../model/colorBar';

import "./VolumeCanvas.css"


interface VolumeCanvasProps extends WithLocale {
    selectedDataset: Dataset | null;
    selectedVariable: Variable | null;
    selectedPlaceInfo: PlaceInfo | null;
    variableColorBar: ColorBar;
    volumeId: string | null;
    volumeRenderMode: VolumeRenderMode;
    volumeIsoThreshold: number;
    volumeStates: VolumeStates;
    updateVolumeState: (volumeId: string, volumeState: VolumeState) => any;
    serverUrl: string;
}

const CANVAS_STYLE: React.CSSProperties = {
    width: '100%',
    height: '680px'
};

const MESSAGE_STYLE: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '1em',
    flexDirection: 'column',
    alignItems: 'center'
};

const HINT_STYLE: React.CSSProperties = {
    color: "orange",
    position: "absolute",
    bottom: 8,
    right: 8,
    zIndex: 10
};

/*TODO: I18N*/
const HINT_ELEMENT = (
        <Typography variant="body2" style={HINT_STYLE} className="hint_wrap">
            Press LMB to rotate, plus CTRL-key to shift.
        </Typography>
);

const DIV_STYLE: React.CSSProperties = {position: "relative"};

const volumeCache: { [volumeId: string]: Volume } = {};


export class VolumeCanvas extends React.PureComponent<VolumeCanvasProps> {
    // static volumeCache: { [volumeId: string]: Volume } = {};
    private volumeScene: VolumeScene | null;
    private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: VolumeCanvasProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.volumeScene = null;
        this.handleLoadVolume = this.handleLoadVolume.bind(this);
    }

    private static getVolumeOptions(props: Readonly<VolumeCanvasProps>): VolumeOptions {
        const {selectedVariable, variableColorBar, volumeIsoThreshold, volumeRenderMode} = props;
        return {
            value1: !!selectedVariable ? selectedVariable.colorBarMin : 0,
            value2: !!selectedVariable ? selectedVariable.colorBarMax : 1,
            renderMode: volumeRenderMode,
            isoThreshold: volumeIsoThreshold,
            colorBar: variableColorBar,
        };
    }

    componentDidMount(): void {
        this.updateVolumeScene();
    }

    componentDidUpdate(prevProps: Readonly<VolumeCanvasProps>): void {
        this.updateVolumeScene();
    }

    componentWillUnmount(): void {
        this.volumeScene = null;
    }

    handleLoadVolume() {
        const volumeScene = this.volumeScene;
        if (volumeScene !== null) {
            const {selectedDataset, selectedVariable, selectedPlaceInfo, volumeId, updateVolumeState} = this.props;
            if (selectedDataset && selectedVariable && volumeId) {
                updateVolumeState(volumeId, {status: 'loading'});
                let bboxArg = '';
                if (selectedPlaceInfo) {
                    let bBox: BBox | null = null;
                    if (selectedPlaceInfo.place.geometry.type === 'Polygon') {
                        bBox = getBBoxFromPolygon(selectedPlaceInfo.place.geometry.coordinates[0]);
                    } else if (selectedPlaceInfo.place.geometry.type === 'MultiPolygon') {
                        const bBoxes: BBox[] = [];
                        for (let i = 0; i < selectedPlaceInfo.place.geometry.coordinates.length; i++) {
                            bBoxes.push(getBBoxFromPolygon(selectedPlaceInfo.place.geometry.coordinates[i][0]));
                        }
                        bBox = getBBoxFromBBoxes(bBoxes);
                    }
                    if (bBox !== null) {
                        bboxArg = `&bbox=${bBox[0]},${bBox[1]},${bBox[2]},${bBox[3]}`;
                    }
                }
                const noCacheArg = `dummy=${new Date().toLocaleTimeString()}`;
                const url = `${this.props.serverUrl}/volumes/`
                            + `${selectedDataset.id}/${selectedVariable.name}`
                            + `?${noCacheArg}${bboxArg}`;
                new NRRDLoader().load(
                        url,
                        (volume: Volume) => {
                            volumeScene.setVolume(volume, VolumeCanvas.getVolumeOptions(this.props));
                            volumeCache[volumeId] = volume;
                            updateVolumeState(volumeId, {status: 'ok'});
                        },
                        () => {
                        },
                        (e: any) => {
                            if (e.response instanceof Response) {
                                e.response.json().then((responseObject: {[k: string]: any}) => {
                                    const errorObject = responseObject.error;
                                    const message = !!errorObject && errorObject.message;
                                    if (errorObject && errorObject.exception) {
                                        console.debug("exception:", errorObject.exception);
                                    }
                                    updateVolumeState(volumeId, {
                                        status: 'error',
                                        message: message || `${e}`
                                    });
                                });
                            } else {
                                updateVolumeState(volumeId, {
                                    status: 'error',
                                    message: `${e}`
                                });
                            }
                        }
                );
            }
        }
    }

    render(): React.ReactNode {
        // console.debug('VolumeCanvas.render-1:', this.canvasRef.current);
        const {volumeId} = this.props;

        let messageComp;
        let loadComp;
        if (!volumeId) {
            /*TODO: I18N*/
            messageComp = [
                <Typography variant={'subtitle2'}>
                    {'Cannot display 3D volume'}
                </Typography>,
                <Typography variant="body2">
                    {'To display a volume, a variable and a place that represents an area must be selected. ' +
                     'Please note that the 3D volume rendering is still an experimental feature.'}
                </Typography>
            ];
        } else {
            const volumeState = this.props.volumeStates[volumeId];

            if (!volumeState || volumeState.status === 'error' || !volumeCache[volumeId]) {
                /*TODO: I18N*/
                loadComp = [
                    <Button
                            onClick={this.handleLoadVolume}
                            color="primary"
                            disabled={!!volumeState && volumeState.status === 'loading'}
                    >
                        {'Load Volume Data'}
                    </Button>,
                    <Typography variant="body2">
                        {'Please note that the 3D volume rendering is still an experimental feature.'}
                    </Typography>
                ];
            }

            if (volumeState) {
                if (volumeState.status === 'loading') {
                    messageComp = (<CircularProgress style={{margin: 10}}/>);
                } else if (volumeState.status === 'error') {
                    /*TODO: I18N*/
                    messageComp = (
                            <Typography variant="body2" color="red">
                                {`Failed loading volume: ${volumeState.message}`}
                            </Typography>
                    );
                }
            }
        }

        if (messageComp) {
            messageComp = (<div style={MESSAGE_STYLE}>{messageComp}</div>);
        }
        if (loadComp) {
            loadComp = (<div style={MESSAGE_STYLE}>{loadComp}</div>);
        }

        // Note, it is important to always have the canvas element
        // rendered here, so it is not remounted.
        return (
                <div style={DIV_STYLE}>
                    {loadComp}
                    {messageComp}
                    <canvas
                            id={'VolumeCanvas-canvas'}
                            ref={this.canvasRef}
                            style={CANVAS_STYLE}
                    />
                    {!messageComp && !loadComp && HINT_ELEMENT}
                </div>
        );
    }

    private updateVolumeScene() {
        const canvas = this.canvasRef.current;
        if (canvas === null) {
            this.volumeScene = null;
            return;
        }
        let volume;
        if (this.props.volumeId) {
            volume = volumeCache[this.props.volumeId];
        }
        let isNewScene = false;
        if (this.volumeScene === null || this.volumeScene.canvas !== canvas) {
            this.volumeScene = new VolumeScene(canvas);
            isNewScene = true;
        }
        if (isNewScene && !!volume) {
            this.volumeScene.setVolume(volume, VolumeCanvas.getVolumeOptions(this.props));
        } else {
            this.volumeScene.setVolumeOptions(VolumeCanvas.getVolumeOptions(this.props));
        }
    }
}

export default VolumeCanvas;

///////////////////////////////////////////////////////////////////////
// BBox helpers
// Move into model/places.ts or so

function getBBoxFromPolygon(coordinates: Position[]): BBox {
    let xMin: number = Number.POSITIVE_INFINITY;
    let yMin: number = Number.POSITIVE_INFINITY;
    let xMax: number = Number.NEGATIVE_INFINITY;
    let yMax: number = Number.NEGATIVE_INFINITY;
    for (const pos of coordinates) {
        const x = pos[0];
        const y = pos[1];
        xMin = Math.min(xMin, x);
        yMin = Math.min(yMin, y);
        xMax = Math.max(xMax, x);
        yMax = Math.max(yMax, y);
    }
    return [xMin, yMin, xMax, yMax];
}

function getBBoxFromBBoxes(bBoxes: BBox[]): BBox {
    let [xMin, yMin, xMax, yMax] = bBoxes[0];
    for (const bBox of bBoxes.slice(1)) {
        xMin = Math.min(xMin, bBox[0]);
        yMin = Math.min(yMin, bBox[1]);
        xMax = Math.max(xMax, bBox[2]);
        yMax = Math.max(yMax, bBox[3]);
    }
    return [xMin, yMin, xMax, yMax];
}
