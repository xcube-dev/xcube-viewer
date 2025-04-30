/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Color, PaletteMode } from "@mui/material";
import {
  blue,
  brown,
  cyan,
  green,
  indigo,
  lightBlue,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

import { ApiServerConfig } from "@/model/apiServer";
import rawDefaultConfig from "@/resources/config.json";
import { AuthClientConfig } from "@/util/auth";
import { Branding, parseBranding } from "@/util/branding";
import baseUrl from "@/util/baseurl";
import { buildPath } from "@/util/path";
import { isNumber } from "./util/types";
import { hasViewerStateApi } from "@/api/hasViewerStateApi";
import { LayerDefinition } from "@/model/layerDefinition";

export const appParams = new URLSearchParams(window.location.search);

interface AuthClient {
  authority?: string;
  clientId?: string;
  audience?: string;
}

interface Layers {
  overlays?: LayerDefinition[];
  baseMaps?: LayerDefinition[];
}

export class Config {
  readonly name: string;
  readonly server: ApiServerConfig;
  readonly branding: Branding;
  readonly layers?: Layers;
  readonly authClient?: AuthClientConfig;
  private static _instance: Config;

  constructor(
    name: string,
    server: ApiServerConfig,
    branding: Branding,
    authClient?: AuthClientConfig,
  ) {
    this.name = name;
    this.server = server;
    this.branding = branding;
    this.authClient = authClient;
  }

  static async load(): Promise<Config> {
    let configPath = appParams.get("configPath") || "config";
    const rawConfig = await this.loadRawConfig(configPath);
    if (rawConfig === rawDefaultConfig) {
      configPath = "";
    }

    const name = (rawConfig.name || "default") as string;
    const authClient = this.getAuthConfig(rawConfig);
    const server = this.getServerConfig(rawConfig);
    const compact = parseInt(appParams.get("compact") || "0") !== 0;
    let branding = parseBranding(
      {
        ...rawDefaultConfig.branding,
        ...(rawConfig.branding as Record<string, unknown>),
        compact:
          compact || (rawConfig.branding as Record<string, unknown>).compact,
      },
      configPath,
    );
    branding = decodeBrandingFlag(branding, "allowUserVariables");
    branding = decodeBrandingFlag(branding, "allow3D");
    branding = decodeBrandingFlag(branding, "allowSharing");
    if (branding.allowSharing) {
      const hasStateApi = await hasViewerStateApi(server.url);
      if (!hasStateApi) {
        branding = { ...branding, allowSharing: false };
      }
    }
    Config._instance = new Config(name, server, branding, authClient);
    if (import.meta.env.DEV) {
      console.debug("Configuration:", Config._instance);
    }
    if (branding.windowTitle) {
      this.changeWindowTitle(branding.windowTitle);
    }
    if (branding.windowIcon) {
      this.changeWindowIcon(branding.windowIcon);
    }
    return Config._instance;
  }

  private static getAuthConfig(
    rawConfig: Record<string, unknown>,
  ): AuthClientConfig | undefined {
    let authClient = (rawConfig.authClient && {
      ...rawConfig.authClient,
    }) as Record<string, unknown> | undefined;
    const authClientFromEnv = Config.getAuthClientFromEnv();
    if (
      !authClient &&
      authClientFromEnv.authority &&
      authClientFromEnv.clientId
    ) {
      authClient = {
        authority: authClientFromEnv.authority,
        client_id: authClientFromEnv.clientId,
      };
    }
    if (authClient) {
      if (authClientFromEnv.authority) {
        const authority = authClientFromEnv.authority;
        authClient = { ...authClient, authority };
      }
      if (authClientFromEnv.clientId) {
        const client_id = authClientFromEnv.clientId;
        authClient = { ...authClient, client_id };
      }
      if (authClientFromEnv.audience) {
        const audience = authClientFromEnv.audience;
        const extraQueryParams = authClient.extraQueryParams as
          | Record<string, unknown>
          | undefined;
        authClient = {
          ...authClient,
          extraQueryParams: { ...extraQueryParams, audience },
        };
      }
    }
    return authClient as AuthClientConfig | undefined;
  }

  private static getServerConfig(
    rawConfig: Record<string, unknown>,
  ): ApiServerConfig {
    const server = {
      ...rawDefaultConfig.server,
      ...(rawConfig.server as ApiServerConfig),
    } as ApiServerConfig;
    const serverFromEnv = Config.getApiServerFromEnv();
    server.id = appParams.get("serverId") || serverFromEnv.id || server.id;
    server.name =
      appParams.get("serverName") || serverFromEnv.name || server.name;
    server.url = appParams.get("serverUrl") || serverFromEnv.url || server.url;
    return server;
  }

  private static async loadRawConfig(configPath: string) {
    let rawConfig: Record<string, unknown> | null = null;
    let rawConfigError = null;
    const configUrl = buildPath(baseUrl.href, configPath, "config.json");
    try {
      const rawConfigResponse = await fetch(configUrl);
      if (rawConfigResponse.ok) {
        rawConfig = await rawConfigResponse.json();
        if (import.meta.env.DEV) {
          console.debug(`Configuration loaded from ${configUrl}`);
        }
      } else {
        const { status, statusText } = rawConfigResponse;
        rawConfigError = `HTTP status ${status}`;
        if (statusText) {
          rawConfigError += ` (${statusText})`;
        }
      }
    } catch (e) {
      rawConfig = null;
      rawConfigError = `${e}`;
    }
    if (rawConfig === null) {
      rawConfig = rawDefaultConfig;
      if (import.meta.env.DEV) {
        console.debug(
          `Failed loading configuration from ${configUrl}:`,
          rawConfigError,
        );
        console.debug(`Using defaults.`);
      }
    }
    return rawConfig;
  }

  static get instance(): Config {
    Config.assertConfigLoaded();
    return Config._instance;
  }

  private static assertConfigLoaded() {
    if (!Config._instance) {
      throw new Error("internal error: configuration not available yet");
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

  private static getAuthClientFromEnv(): AuthClient {
    const authority = import.meta.env.XCV_OAUTH2_AUTHORITY;
    const clientId = import.meta.env.XCV_OAUTH2_CLIENT_ID;
    const audience = import.meta.env.XCV_OAUTH2_AUDIENCE;
    return { authority, clientId, audience };
  }

  private static getApiServerFromEnv(): Partial<ApiServerConfig> {
    const id = import.meta.env.XCV_APP_SERVER_ID;
    const name = import.meta.env.XCV_SERVER_NAME;
    const url = import.meta.env.XCV_SERVER_URL;
    return { id, name, url };
  }
}

// Array of user place colors in stable order (see #153)
export const userPlaceColorsArray: [string, Color][] = [
  ["red", red],
  ["yellow", yellow],
  ["blue", blue],
  ["pink", pink],
  ["lightBlue", lightBlue],
  ["green", green],
  ["orange", orange],
  ["lime", lime],
  ["purple", purple],
  ["indigo", indigo],
  ["cyan", cyan],
  ["brown", brown],
  ["teal", teal],
];

const userPlaceColors: { [name: string]: Color } = (() => {
  const obj: { [name: string]: Color } = {};
  userPlaceColorsArray.forEach(([name, color]) => {
    obj[name] = color;
  });
  return obj;
})();

export const userPlaceColorNames = userPlaceColorsArray.map(
  ([name, _]) => name,
);

export function getStrokeShade(paletteMode: PaletteMode) {
  return paletteMode === "light" ? 800 : 400;
}

export function getUserPlaceColorName(index: number): string {
  return userPlaceColorNames[index % userPlaceColorNames.length];
}

export function getUserPlaceColor(
  colorName: string,
  paletteMode: PaletteMode,
): string {
  const shade = getStrokeShade(paletteMode);
  return userPlaceColors[colorName][shade];
}

export function getUserPlaceFillOpacity(opacity?: number): number {
  if (!isNumber(opacity)) {
    opacity = Config.instance.branding.polygonFillOpacity;
  }
  return isNumber(opacity) ? opacity : 0.25;
}

function decodeBrandingFlag(
  branding: Branding,
  flagName: keyof Branding,
): Branding {
  const _flagValue = appParams.get(flagName);
  const flagValue: boolean = _flagValue
    ? !!parseInt(_flagValue)
    : branding[flagName] !== false;
  return { ...branding, [flagName]: flagValue };
}
