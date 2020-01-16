import {
    blue,
    green,
    grey,
    purple,
    red,
    pink,
    yellow,
    orange,
    cyan,
    indigo,
    deepPurple
} from '@material-ui/core/colors';
import { Color, PaletteType } from '@material-ui/core';
import { PaletteColorOptions } from '@material-ui/core/styles/createPalette';

import { LanguageDictionary } from './util/lang';
import { getQueryParameterByName } from './util/qparam';
import lang from './resources/lang.json';

const version = '0.4.0-dev.0';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface Branding {
    appBarTitle: string;
    windowTitle: string;
    defaultApiServerId: string;
    defaultApiServerName: string;
    defaultApiServerUrl: string;
    themeName: 'dark' | 'light';
    primaryColor: PaletteColorOptions;
    secondaryColor: PaletteColorOptions;
    headerBackgroundColor?: string;
    logoPath: any;
    logoWidth: number;
    baseMapUrl?: string;
}

const brandings: { [name: string]: Branding } = {
    'default': {
        appBarTitle: 'xcube Viewer',
        windowTitle: 'xcube Viewer',
        defaultApiServerId: 'local',
        defaultApiServerName: 'Local Server',
        defaultApiServerUrl: 'http://localhost:8080',
        themeName: 'dark',
        primaryColor: blue,
        secondaryColor: pink,
        headerBackgroundColor: undefined,
        logoPath: require('./resources/default/logo.png'),
        logoWidth: 32,
        baseMapUrl: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    },
    'eodatabee': {
        appBarTitle: 'Demo Viewer',
        windowTitle: 'EODataBee Demo Viewer',
        defaultApiServerId: 'eodatabee',
        defaultApiServerName: 'EODataBee Server',
        defaultApiServerUrl: 'https://xcube2.dcs4cop.eu/dcs4cop-dev/api/latest',
        themeName: 'dark',
        primaryColor: {
            light: '#ffd77c',
            main: '#ffc942',
            dark: '#b78c2f',
            contrastText: '#fff',
        },
        secondaryColor: pink,
        headerBackgroundColor: undefined,
        logoPath: require('./resources/eodatabee/logo.png'),
        logoWidth: 150,
        baseMapUrl: 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    },
    'cyanoalert': {
        appBarTitle: '',
        windowTitle: 'CyanoAlert Viewer',
        defaultApiServerId: 'cyanoalert',
        defaultApiServerName: 'CyanoAlert Server',
        defaultApiServerUrl: 'https://cyanoalert.brockmann-consult.com/api/latest',
        themeName: 'dark',
        primaryColor: {
            light: '#ceef64',
            main: '#9abc31',
            dark: '#688c00',
            contrastText: '#fff',
        },
        secondaryColor: deepPurple,
        headerBackgroundColor: undefined,
        logoPath: require('./resources/cyanoalert/logo.png'),
        logoWidth: 120,
        baseMapUrl: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
    },
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const brandingName = process.env.REACT_APP_BRANDING || 'default';
const branding = brandings[brandingName];

if (!branding) {
    throw new Error(`illegal branding "${brandingName}"!`);
}

if (branding.windowTitle) {
    document.title = branding.windowTitle;
}

export const I18N = new LanguageDictionary(lang);


interface TileAccess {
    param: string;
    token: string;
}


const defaultApiServer = {
    id: branding.defaultApiServerId,
    name: getQueryParameterByName(null, 'serverName', branding.defaultApiServerName)!,
    url: getQueryParameterByName(null, 'serverUrl', branding.defaultApiServerUrl)!,
};

const apiServers = [
    {...defaultApiServer},
];


export function getVersion() {
    return version;
}

export function getBrandingName() {
    return brandingName;
}

export function getBranding() {
    return branding;
}

export function getDefaultApiServer() {
    return defaultApiServer;
}

export function getApiServers() {
    return apiServers;
}

const userPlaceColors: { [name: string]: Color } = {
    blue,
    green,
    grey,
    purple,
    red,
    pink,
    yellow,
    orange,
    cyan,
    indigo,
    deepPurple,
};
export const userPlaceColorNames = Object.keys(userPlaceColors);


export function getStrokeShade(paletteType: PaletteType) {
    return paletteType === 'light' ? 800 : 400;
}

export function getUserPlaceColorName(index: number): string {
    return userPlaceColorNames[index % userPlaceColorNames.length];
}

export function getUserPlaceColor(colorName: string, paletteType: PaletteType): string {
    const shade = getStrokeShade(paletteType);
    return userPlaceColors[colorName][shade];
}

// See resources/maps.json
const tileAccess: { [name:string]: TileAccess } = {
    'Mapbox': {
        param: 'access_token',
        token: 'pk.eyJ1IjoiZm9ybWFuIiwiYSI6ImNrM2JranV0bDBtenczb2szZG84djh6bWUifQ.q0UKwf4CWt5fcQwIDwF8Bg'
    },
};


export function getTileAccess(groupName: string) {
    return tileAccess[groupName];
}
