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

import { Color, PaletteType } from '@material-ui/core';
import {
    cyan,
    deepPurple,
    green,
    indigo,
    lightBlue,
    lime,
    orange,
    pink,
    purple,
    red,
    yellow,
} from '@material-ui/core/colors';
import { ApiServerConfig } from './model/apiServer';
import rawDefaultConfig from './resources/config.json';
import { AuthClientConfig } from './util/auth';
import { Branding, parseBranding } from './util/branding';


export const appParams = new URLSearchParams(window.location.search);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Config {
    readonly name: string;
    readonly server: ApiServerConfig;
    readonly branding: Branding;
    readonly authClient?: AuthClientConfig;
    private static _instance: Config;

    constructor(
        name: string,
        server: ApiServerConfig,
        branding: Branding,
        authClient?: AuthClientConfig
    ) {
        this.name = name;
        this.server = server;
        this.branding = branding;
        this.authClient = authClient;
    }

    static async load(): Promise<Config> {
        let configPath = appParams.get('configPath') || 'config';
        let rawConfig;
        try {
            const configUrl = window.location.origin + `/${configPath}/config.json`;
            rawConfig = await fetch(configUrl);
            rawConfig = await rawConfig.json();
            if (process.env.NODE_ENV === 'development') {
                console.debug(`Configuration loaded.`);
            }
        } catch (e) {
            configPath = '';
            rawConfig = rawDefaultConfig;
            if (process.env.NODE_ENV === 'development') {
                console.debug(`Using default configuration.`, e);
            }
        }

        const name = rawConfig.name || 'default';
        const authClient = rawConfig.authClient && {...rawConfig.authClient};
        const server = {...rawDefaultConfig.server, ...rawConfig.server} as ApiServerConfig;
        server.id = appParams.get('serverId') || server.id;
        server.name = appParams.get('serverName') || server.name;
        server.url = appParams.get('serverUrl') || server.url;
        const branding = parseBranding(
            {
                ...rawDefaultConfig.branding,
                ...rawConfig.branding
            },
            configPath
        );
        Config._instance = new Config(name, server, branding, authClient);
        if (process.env.NODE_ENV === 'development') {
            console.debug('Configuration:', Config._instance);
        }
        if (branding.windowTitle) {
            this.changeWindowTitle(branding.windowTitle);
        }
        if (branding.windowIcon) {
            this.changeWindowIcon(branding.windowIcon);
        }
        return Config._instance;
    }

    static get instance(): Config {
        Config.assertConfigLoaded();
        return Config._instance;
    }

    private static assertConfigLoaded() {
        if (!Config._instance) {
            throw new Error('internal error: configuration not available yet');
        }
    }

    private static changeWindowTitle(title: string) {
        document.title = title;
    }

    private static changeWindowIcon(iconUrl: string) {
        let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (favicon !== null) {
            favicon.href = iconUrl;
        } else {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            favicon.href = iconUrl;
            document.head.appendChild(favicon);
        }
    }
}

// TODO (forman): The following functions should be made part of the configuration.


interface TileAccess {
    param: string;
    token: string;
}


// Array of user place colors in stable order (see #153)
const userPlaceColorsArray: [string, Color][] = [
    ["yellow", yellow],
    ["red", red],
    ["pink", pink],
    ["lightBlue", lightBlue],
    ["green", green],
    ["orange", orange],
    ["lime", lime],
    ["purple", purple],
    ["indigo", indigo],
    ["cyan", cyan],
    ["deepPurple", deepPurple],
];

const userPlaceColors: { [name: string]: Color } = (() => {
    const obj: { [name: string]: Color } = {};
    userPlaceColorsArray.forEach(([name, color]) => {
        obj[name] = color;
    });
    return obj;
})();

export const userPlaceColorNames = userPlaceColorsArray.map(([name, _]) => name);


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
const tileAccess: { [name: string]: TileAccess } = {
    'Mapbox': {
        param: 'access_token',
        token: 'pk.eyJ1IjoiZm9ybWFuIiwiYSI6ImNrM2JranV0bDBtenczb2szZG84djh6bWUifQ.q0UKwf4CWt5fcQwIDwF8Bg'
    },
};


export function getTileAccess(groupName: string) {
    return tileAccess[groupName];
}


