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
import { Button, Typography } from "@material-ui/core";
import { Dataset } from '../model/dataset';
import { PlaceInfo } from '../model/place';
import { Variable } from '../model/variable';
import { WithLocale } from '../util/lang';
import { VolumeRenderMode, VolumeState, VolumeStates } from "../states/controlState";
import { VolumeScene } from "../volume/VolumeScene";
import { Volume } from "../volume/Volume";
import { NRRDLoader } from "../volume/NRRDLoader";
import CircularProgress from "@material-ui/core/CircularProgress";
import { updateVolumeState } from "../actions/controlActions";


interface VolumeCanvasProps extends WithLocale {
    selectedDataset: Dataset | null;
    selectedVariable: Variable | null;
    selectedPlaceInfo: PlaceInfo | null;
    volumeId: string | null;
    volumeRenderMode: VolumeRenderMode;
    volumeIsoThreshold: number;
    volumeStates: VolumeStates;
    updateVolumeState: (volumeId: string, volumeState: VolumeState) => any;
}

const CANVAS_STYLE = {width: '100%', height: '680px'};

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
        console.debug('VolumeCanvas.constructor:', this.canvasRef.current, volumeCache);
    }

    private static getVolumeOptions(props: Readonly<VolumeCanvasProps>) {
        const {selectedVariable, volumeIsoThreshold, volumeRenderMode} = props;
        return {
            value1: !!selectedVariable ? selectedVariable.colorBarMin : 0,
            value2: !!selectedVariable ? selectedVariable.colorBarMax : 1,
            renderMode: volumeRenderMode,
            isoThreshold: volumeIsoThreshold,
            cmName: 'viridis',  // TODO (forman)
        };
    }

    componentDidMount(): void {
        console.debug('VolumeCanvas.componentDidMount:', this.canvasRef.current, volumeCache);
        this.updateVolumeScene();
    }

    componentDidUpdate(prevProps: Readonly<VolumeCanvasProps>): void {
        console.debug('VolumeCanvas.componentDidUpdate:', this.canvasRef.current, volumeCache);
        this.updateVolumeScene();
    }

    componentWillUnmount(): void {
        console.debug('VolumeCanvas.componentWillUnmount:', this.canvasRef.current, volumeCache);
        this.volumeScene = null;
    }

    handleLoadVolume() {
        const volumeScene = this.volumeScene;
        if (volumeScene !== null) {
            const {selectedDataset, selectedVariable, volumeId, updateVolumeState} = this.props;
            if (selectedDataset && selectedVariable && volumeId) {
                console.info('updateVolumeState', updateVolumeState, volumeId)
                updateVolumeState(volumeId, 'loading');
                const url = `http://127.0.0.1:8080/volumes/${selectedDataset.id}/${selectedVariable.name}?dummy=4`;
                new NRRDLoader().load(
                    url,
                    (volume: Volume) => {
                        updateVolumeState(volumeId, 'ok');
                        volumeScene.setVolume(volume, VolumeCanvas.getVolumeOptions(this.props));
                        volumeCache[volumeId] = volume;
                    },
                    () => {
                    },
                    () => {
                        updateVolumeState(volumeId, 'error');
                    });
            }
        }
    }

    render(): React.ReactNode {
        console.debug('VolumeCanvas.render-1:', this.canvasRef.current);
        const {volumeId} = this.props;

        let altComp;
        if (!volumeId) {
            altComp = (
                <>
                    <Typography variant={"subtitle2"}>
                        /*TODO: I18N*/
                        {'Cannot display volume'}
                    </Typography>
                    <Typography variant="body2">
                        /*TODO: I18N*/
                        {'To display a volume, a variable and a place that represents an area must be selected.'}
                    </Typography>
                </>
            );
        } else {
            const volumeState = this.props.volumeStates[volumeId];
            if (volumeState === 'loading') {
                altComp = (<CircularProgress style={{margin: 10}}/>);
            } else if (volumeState === 'error') {
                /*TODO: I18N*/
                altComp = (<Typography variant="body2">{'Error loading volume!'}</Typography>);
            } else if (volumeState !== 'ok' || !volumeCache[volumeId]) {
                altComp = (
                    /*TODO: I18N*/
                    <Button onClick={this.handleLoadVolume}>{'Load Volume Data'}</Button>
                );
            }
        }

        return (
            <>
                {altComp}
                <canvas
                    id={"VolumeCanvas-canvas"}
                    ref={this.canvasRef}
                    style={CANVAS_STYLE}
                />
            </>
        );
    }

    private updateVolumeScene() {
        const canvas = this.canvasRef.current;
        if (canvas === null) {
            this.volumeScene = null;
            return;
        }
        if (this.volumeScene === null || this.volumeScene.canvas !== canvas) {
            this.volumeScene = new VolumeScene(canvas);
        }
        let volumeSet = false;
        if (this.props.volumeId) {
            const volume = volumeCache[this.props.volumeId];
            if (volume) {
                console.log("GOT VOLUME!");
                this.volumeScene.setVolume(volume, VolumeCanvas.getVolumeOptions(this.props));
                volumeSet = true;
            } else {
                console.log("GOT NO VOLUME!");
            }
        }
        if (!volumeSet) {
            this.volumeScene.setVolumeOptions(VolumeCanvas.getVolumeOptions(this.props));
        }
    }
}

export default VolumeCanvas;
