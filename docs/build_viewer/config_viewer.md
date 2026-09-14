# xcube Viewer Configuration Overview

Use the Viewer configuration to customize an xcube Viewer instance for your 
deployment. The configuration defines the connected xcube Server, optional 
authentication, branding, map layers, default map behaviour, and the Viewer 
features available to users.

This reference describes the main configuration sections and their supported 
properties. For details on referencing the Viewer configuration from 
xcube Server, see the [xcube documentation](https://xcube.readthedocs.io/en/latest/cli/xcube_serve.html#viewer-configuration-optional).

## Top-level configuration

| Property     | Type   | Required | Description                         |
| ------------ | ------ | -------- |-------------------------------------|
| `name`       | string | ✅        | Name of the Viewer                  |
| `authClient` | object | ❌        | Authentication client configuration |
| `server`     | object | ✅        | xcube API server configuration      |
| `branding`   | object | ✅        | UI, map, and feature configuration  |

---

## `authClient`

| Property           | Type         | Required | Description                      | Example                                       |
| ------------------ | ------------ | -------- | -------------------------------- |-----------------------------------------------|
| `authority`        | string (URI) | ✅        | Auth provider URL                | `https://xcube-dev.eu.auth0.com`              |
| `client_id`        | string       | ✅        | OAuth client ID                  | `xxxxxxxxxxxxxxxxxxxxxxxx`                    |
| `redirect_uri`     | string (URI) | ❌        | Redirect URL after login         | `https://xcube-dev.eu.auth0.com/viewer`       |
| `extraQueryParams` | object       | ❌        | Additional auth query parameters | `{ "audience": "https://xcube-dev.eu/api/" }` |

---

## `server`

| Property | Type         | Required | Description      | Example                       |
| -------- | ------------ | -------- | ---------------- |-------------------------------|
| `id`     | string       | ✅        | Unique server ID | `local`                       |
| `name`   | string       | ✅        | Display name     | `Local Server`                |
| `url`    | string (URI) | ✅        | API endpoint     | `https://localhost:8080/api/` |

---

## `branding`

### General UI

| Property                | Type          | Default / Allowed         | Description             |
| ----------------------- | ------------- | ------------------------- |-------------------------|
| `appBarTitle`           | string        | —                         | Title in the app bar    |
| `windowTitle`           | string        | —                         | Browser tab title       |
| `windowIcon`            | string / null | —                         | Path to favicon         |
| `themeMode`             | string        | `dark`, `light`, `system` | Theme mode              |
| `logoImage`             | string        | —                         | Path to logo image      |
| `logoWidth`             | integer ≥ 0   | —                         | Logo width in px        |
| `headerBackgroundColor` | string        | e.g. `#fafafa`            | Header background color |

---

### Colors

| Property         | Type        | Description        |
| ---------------- | ----------- | ------------------ |
| `primaryColor`   | ColorSchema | Primary UI color   |
| `secondaryColor` | ColorSchema | Secondary UI color |

**Supported formats:**

| Format      | Example                                            |
| ----------- | -------------------------------------------------- |
| Hex         | `"#001c32"`                                        |
| Named color | `"lime"`                                           |
| MUI palette | `{ "main": "#9abc31", "contrastText": "#ffffff" }` |

**Allowed named colors:**

```
amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple,
green, grey, indigo, lightBlue, lightGreen, lime, orange,
pink, purple, red, teal, yellow
```

---

### Map & Layers

| Property             | Type         | Description                          |
| -------------------- | ------------ | ------------------------------------ |
| `layers`             | object       | Custom base maps and overlays        |
| `layerVisibilities`  | object       | Initial layer visibility settings    |
| `mapProjection`      | string       | `EPSG:4326` or `EPSG:3857` (default) |
| `polygonFillOpacity` | number (0–1) | Opacity for polygons                 |

#### `layers`

| Property   | Type    | Description     |
| ---------- | ------- | --------------- |
| `overlays` | Layer[] | Overlay layers  |
| `baseMaps` | Layer[] | Base map layers |

#### `Layer`

| Property      | Type   | Required | Description       |
| ------------- | ------ | -------- |-------------------|
| `id`          | string | ✅        | Unique ID         |
| `type`        | string | ✅        | Layer type        |
| `title`       | string | ✅        | Display name      |
| `url`         | string | ✅        | Tile/service URL  |
| `attribution` | string | ❌        | Attribution text  |
| `wms`         | object | ❌        | WMS configuration |

#### `Layer.wms`

| Property    | Type   | Required |
| ----------- | ------ | -------- |
| `layerName` | string | ✅        |
| `styleName` | string | ❌        |

#### `layerVisibilities`

Dynamic object mapping layer IDs to visibility:

```json
{
  "datasetVariable": true,
  "datasetBoundary": false,
  "userPlaces": true,
  "overlays.darkMatterLabels": true,
  "baseMaps.darkMatterNoLabels": true
}
```

| Key          | Type    | Description                               |
| ------------ | ------- | ----------------------------------------- |
| `<layer-id>` | boolean | Show (`true`) or hide (`false`) the layer |


---

### Aggregation

| Property     | Type   | Allowed Values                 |
| ------------ | ------ | ------------------------------ |
| `defaultAgg` | string | `mean`, `median`, `min`, `max` |

---

### Additional features
 
| Property              | Type    | Default | Description                                              |
| --------------------- | ------- | ------- |----------------------------------------------------------|
| `allowDownloads`      | boolean | `true`  | Enable downloads                                         |
| `allowRefresh`        | boolean | `true`  | Enable refresh                                           |
| `allowSharing`        | boolean | `true`  | Enable sharing (of persisted Viewer state via permalink) |
| `allowViewModePython` | boolean | `true`  | Enable Python mode                                       |
| `allowUserVariables`  | boolean | `true`  | Enable custom variables                                  |
| `allow3D`             | boolean | `true`  | Enable 3D view                                           |
| `allowAboutPage`      | boolean | `false` | Show **About** page                                      |

---

### Permalinks

| Property                  | Type          | Default | Description                                                                                                                                                                                                                                                               |
| ------------------------- | ------------- | ------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `permalinkExpirationDays` | number / null | `null`  | Expiration time for shared links, needs to be further. This property only sets the text in the pop-up window. Permalink handling needs to be set up in [xcube Server configuration](https://xcube.readthedocs.io/en/latest/cli/xcube_serve.html#viewer-state-persistence) |

