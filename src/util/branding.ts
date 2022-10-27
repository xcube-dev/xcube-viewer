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
} from '@material-ui/core/colors';
import {Color} from '@material-ui/core';
import {PaletteColorOptions} from '@material-ui/core/styles/createPalette';
import { CSSProperties } from "react";


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
        const imageUrl = window.location.origin + '/'
            + (configPath !== '' ? `${configPath}/${imagePath}` : imagePath);
        brandingConfig[key] = imageUrl;
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

/*
const config: { [name: string]: Branding } = {
    'default': {
        appBarTitle: 'xcube Viewer',
        windowTitle: 'xcube Viewer',
        defaultApiServerId: 'local',
        defaultApiServerName: 'Local Server',
        defaultApiServerUrl: defaultApiServerUrl || 'http://localhost:8080',
        themeName: 'dark',
        primaryColor: blue,
        secondaryColor: pink,
        headerBackgroundColor: undefined,
        logoImage: require('./resources/default/resources.png').default,
        logoWidth: 32,
        baseMapUrl: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        defaultAgg: 'mean',
    },
    'esdl': {
        appBarTitle: 'ESDL Viewer',
        windowTitle: 'ESDL Viewer',
        defaultApiServerId: 'esdl',
        defaultApiServerName: 'ESDL Server',
        defaultApiServerUrl: 'https://xcube.earthsystemdatalab.net',
        themeName: 'light',
        primaryColor: grey,
        secondaryColor: pink,
        headerBackgroundColor: grey['50'],
        logoImage: require('./resources/config/esdl/resources.png').default,
        logoWidth: 64,
        baseMapUrl: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        defaultAgg: 'mean',
    },
    'eodatabee': {
        appBarTitle: 'Demo Viewer',
        windowTitle: 'EODataBee Demo Viewer',
        defaultApiServerId: 'eodatabee',
        defaultApiServerName: 'EODataBee Server',
        defaultApiServerUrl: defaultApiServerUrl || 'https://xcube2.dcs4cop.eu/dcs4cop-dev/api/latest',
        themeName: 'dark',
        primaryColor: {
            light: '#ffd77c',
            main: '#ffc942',
            dark: '#b78c2f',
            contrastText: '#fff',
        },
        secondaryColor: pink,
        headerBackgroundColor: undefined,
        logoImage: require('./resources/config/eodatabee/resources.png').default,
        logoWidth: 150,
        baseMapUrl: 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        defaultAgg: 'mean',
    },
    'cyanoalert': {
        appBarTitle: '',
        windowTitle: 'CyanoAlert Viewer',
        defaultApiServerId: 'cyanoalert',
        defaultApiServerName: 'CyanoAlert Server',
        defaultApiServerUrl: defaultApiServerUrl || 'https://cyanoalert.brockmann-consult.com/api/latest',
        themeName: 'dark',
        primaryColor: {
            light: '#ceef64',
            main: '#9abc31',
            dark: '#688c00',
            contrastText: '#fff',
        },
        secondaryColor: deepPurple,
        headerBackgroundColor: undefined,
        logoImage: require('./resources/config/cyanoalert/resources.png').default,
        logoWidth: 120,
        baseMapUrl: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
        defaultAgg: 'median',
        polygonFillOpacity: 0.025,
    },
};
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
