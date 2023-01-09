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

import { CSSProperties } from "react";
import {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepOrange,
    deepPurple,
    green,
    grey,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow,
} from '@mui/material/colors';
import {Color} from '@mui/material';
import { PaletteColorOptions } from '@mui/material/styles';
import baseUrl from './baseurl';
import { buildPath } from './path';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const COLORS: { [name: string]: Partial<Color> } = {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepOrange,
    deepPurple,
    green,
    grey,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow,
};

// Align any changes made here with
// - resources/config.json
// - resources/config.schema.json
export interface Branding {
    appBarTitle: string;
    windowTitle: string;
    windowIcon: string | null;
    themeName: 'dark' | 'light';
    primaryColor: PaletteColorOptions;
    secondaryColor: PaletteColorOptions;
    headerBackgroundColor?: string;
    headerTitleStyle?: CSSProperties;
    headerIconStyle?: CSSProperties;
    organisationUrl?: string;
    logoImage: any;
    logoWidth: number;
    baseMapUrl?: string;
    defaultAgg?: 'median' | 'mean';
    polygonFillOpacity?: number;
    mapProjection?: string;
    allowDownloads?: boolean;
    allowRefresh?: boolean;
}


function setBrandingColor(brandingConfig: any, key: keyof Branding) {
    const colorName = brandingConfig[key];
    if (typeof colorName === 'string') {
        const color = COLORS[colorName];
        if (color) {
            brandingConfig[key] = color;
        } else {
            throw new Error(`branding.${key} "${colorName}" is invalid`);
        }
    }
}

function setBrandingImage(brandingConfig: any, key: keyof Branding, configPath: string) {
    const imagePath = brandingConfig[key];
    if (typeof imagePath === 'string') {
        brandingConfig[key] = buildPath(baseUrl.href, configPath, imagePath);
    }
}

export function parseBranding(brandingConfig: any, configPath: string): Branding {
    brandingConfig = {...brandingConfig};
    setBrandingColor(brandingConfig, 'primaryColor');
    setBrandingColor(brandingConfig, 'secondaryColor');
    setBrandingImage(brandingConfig, 'logoImage', configPath);
    return brandingConfig as Branding;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
