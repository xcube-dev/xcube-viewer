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
import { useEffect, useRef } from 'react';

import i18n from '../i18n';
import { ColorBar } from '../model/colorBar';

import bgImageData from "./bg.png";

const bgImage = new Image();
bgImage.src = bgImageData;


interface ColorBarCanvasProps {
    colorBar: ColorBar;
    imageData: string;
    opacity: number;
    width: number | string | undefined;
    height: number | string | undefined;
    onOpenEditor: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const ColorBarCanvas: React.FC<ColorBarCanvasProps> = (
        {
            colorBar,
            imageData,
            opacity,
            width,
            height,
            onOpenEditor
        }
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            return;
        }
        const image = new Image();
        image.onload = () => {
            renderColorBar(colorBar, opacity, canvas, image);
        };
        image.src = `data:image/png;base64,${imageData}`;
    }, [colorBar, imageData, opacity]);

    return <>
        {Boolean(imageData) ? (
                <canvas
                        ref={canvasRef}
                        width={width || 240}
                        height={height || 24}
                        onClick={onOpenEditor}
                />
        ) : (
                <div>{i18n.get('Unknown color bar') + `: ${colorBar.baseName}`}</div>
        )}
    </>;
}


function renderColorBar(colorBar: ColorBar,
                        opacity: number,
                        canvas: HTMLCanvasElement,
                        image: HTMLImageElement) {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = image.width;
    offscreenCanvas.height = image.height;
    const ctx = offscreenCanvas.getContext("2d");
    if (ctx === null) {
        return;
    }
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(
            0, 0,
            offscreenCanvas.width,
            offscreenCanvas.height
    );

    let rgbaArray = imageData.data;

    if (colorBar.isReversed) {
        const reversedRgbaArray = new Uint8ClampedArray(rgbaArray.length);
        for (let i = 0; i < rgbaArray.length; i += 4) {
            const j = rgbaArray.length - i - 4;
            reversedRgbaArray[j] = rgbaArray[i];
            reversedRgbaArray[j + 1] = rgbaArray[i + 1];
            reversedRgbaArray[j + 2] = rgbaArray[i + 2];
            reversedRgbaArray[j + 3] = rgbaArray[i + 3];
        }
        rgbaArray = reversedRgbaArray;
    }

    if (colorBar.isAlpha) {
        const factor = 256 * 2 / rgbaArray.length;
        for (let i = 0; i < rgbaArray.length / 2; i += 4) {
            rgbaArray[i + 3] = factor * i;
        }
    }

    if (opacity < 1.0) {
        for (let i = 0; i < rgbaArray.length; i += 4) {
            rgbaArray[i + 3] *= opacity;
        }
    }

    Promise.resolve(
            createImageBitmap(
                    new ImageData(rgbaArray,
                            rgbaArray.length / 4,
                            1)
            )
    ).then(imageBitmap => {
        const ctx = canvas.getContext("2d");
        if (ctx !== null) {
            const pattern = ctx.createPattern(bgImage, "repeat");
            if (pattern !== null) {
                ctx.fillStyle = pattern;
            } else {
                ctx.fillStyle = "#ffffff";
            }
            ctx.fillRect(
                    0, 0,
                    canvas.width, canvas.height
            );
            ctx.drawImage(
                    imageBitmap,
                    0, 0,
                    canvas.width, canvas.height
            );
        }
    });
}



