## Changes in version 1.4.3 (in development)

### Improvements

* Redesigned the right side panel: (#477)
  - Replaced the tabs by a sidebar comprising panel icons;
    extension panels can now be positioned and can have own icons. 
  - Restyled many side panels
  - The panel's resize handle now provides visual feedback 
    when hovering over it.

* Variable layer legends are now styled according to the 
  current theme mode. (#491)

* Added a `Divider` to provide a visual separation of control bar items for
  better clarity to the users. (#487)

* Various style adjustments with respect to the current theme modes 

  _Dark_ and _Light_.
  
* Renamed "Info" panel into "Details"; using new icon too.

* Improved _Developer Reference_ documentation.

* Improved UX as users can now easily identify which dataset a variable belongs 
  to in variable comparison mode on the map. The infobox (when enabled and 
  hovered) marks variables with `(R)` and `(L)`, clarifying their dataset 
  origins when the same variable appears from different datasets. 

* Users can now also identify the datasets in the Time Series chart.

* Toolbars on time-series and statistics charts now fade into the background 
  until you hover over them, reducing visual clutter and improving focus on the 
  data.

### Fixes

* Fixed a problem where mouse splitters used to resize 
  two components (e.g., two layers in map view, or map view and side panels) 
  created a drift while dragging.

* Added some missing language translations.

* Fixed the map's infobox as it now correctly removes the second variable when the 

  user disables variable comparison mode.

### Other Changes

* Updated development tools. Now using 
  - `vite 6.2` 
  - `eslint 9.21`
  - `storybook 8.6`

* Added `selectedPlace` and `selectedPlaceGroup` to the list 
  of available state properties. (#455)



## Changes in version 1.4.2

### New features

* Added `Markdown` component to be used in server-side extensions.
  It has a single `text` property that takes the markdown text.
* We now render the new `description` markdown properties received from
  xcube Server (see https://github.com/xcube-dev/xcube/issues/1122)
  in the info panel. (#454)

### Improvements

* Rearranged the info-panel for improved clarity and ease of use.
* Now displaying dataset titles in the map legend. (#419)

### Fixes and other Changes

* The new "share" button no longer appears if the xcube Server has no
  respective API configuration. (#470)
* Fixed regression when zooming into time-series charts. (#468)
* Updated copyright headers in source files.

## Changes in version 1.4.1 

* Fixed issues with the Share feature introduced in
  version 1.4.0. (#460) (#462)

## Changes in version 1.4.0

### New Features

* Added a new "share" action to the app bar.
  It creates a permalink URL to restore the view state
  and copies it to the clipboard. (#447)

  The restored state includes
  - Selected map region, zoom level, and overlays.
  - User places including the selected place.
  - Opened panels, active tabs, and any selected options.
  - Other UI-specific states such as selected items, filters, or toggle states.

* Starting with xcube Server 1.8 and xcube Viewer 1.4 it is possible to enhance
  the viewer UI by _server-side contributions_ programmed in Python.
  For this to work, service providers can now configure xcube Server to load
  one or more Python modules that provide UI-contributions of type
  `xcube.webapi.viewer.contrib.Panel`.
  Users can create `Panel` objects and use the two decorators
  `layout()` and `callback()` to implement the UI and the interaction
  behaviour, respectively. The new functionality is provided by the
  [Chartlets](https://bcdev.github.io/chartlets/) Python library.

  A working example can be found in the
  [xcube repository](https://github.com/xcube-dev/xcube/tree/5ebf4c76fdccebdd3b65f4e04218e112410f561b/examples/serve/panels-demo).

### Other changes

* Updated dependencies, development dependencies and updated TypeScript code base accordingly.
    - `react` from v17 to v18
    - `react-dom` from v17 to v18
    - `mui` from v5 to v6
    - `testing-library/react` from v12 to v16

* Tooltips (incl. translation) have been added to the toggle buttons that 
  control the format of the metadata information in the sidebar.

## Changes in version 1.3.1

### New Features 

* Users can now change the application theme from light, dark or system mode from settings.
  
### Fixes

* The `<Time>` parameter is now no longer required to calculate the statistics 
  of the selected Point/Polygon for datasets that do not contain a time 
  dimension. (#421)

* Statistics and also the map's info-box now also work for datasets with 
  non-geographic grids.
  (See xcube server issues https://github.com/xcube-dev/xcube/issues/1066
  and https://github.com/xcube-dev/xcube/issues/1069)

* The help icon button now opens the new documentation 
  [xcube Viewer documentation](https://xcube-dev.github.io/xcube-viewer/) 
  in a new browser tab.

### Other changes

* Tooltips (incl. translations) have been added to the Time Player buttons
  for jumping to the first, last, next and previous time steps.

* Updated language translations (German and Swedish) for `Add Statistics`
  and `Style Place`.

## Changes in version 1.3.0

### New Features 

* Users can now copy snapshots of a time-series charts and statistics
  into the clipboard by clicking a new camera icon on a chart's action bar.
  (#290)

* It is now possible to change the color and opacity of user places
  and hence associated time-series and statistic charts. (#97, #216)

* When in map split mode each of the two variables has its own
  variable color legend with same functionality. (#401)

* Users can now enable a small pixel information box being displayed
  next to the pointer when hovering over the map. It shows the current 
  map coordinates and the values of the currently selected variable at 
  that position. The feature is switched on and off from the layer 
  selector menu. (#404)

* The datasets in the dataset selector are now sorted by name and may
  also be grouped if configured so in xcube server. (#385)

* Users can now define their own variables computed from Python-like
  expressions. The expressions can combine other variables of the
  current dataset using almost all Python operators and all
  [numpy universal functions](https://numpy.org/doc/stable/reference/ufuncs.html#available-ufuncs).  
  User data variables are persisted in the browser's local storage.
  (#371)

* Now recognising new custom color maps from xcube server, for details 
  refer to https://github.com/xcube-dev/xcube/issues/1046. (#392)

### Enhancements

* Avoiding confusion regarding variable comparison.
  No longer using the term _second variable_ and the `(#2)` suffix in
  variable titles. Instead, it is now the _pinned variable_.
  A pin icon is now used to mark a pinned variable in lists.  (#407)

* Moved map-related actions directly into the map, namely
  - show/hide map layer panel (moved from main toolbar);
  - enable/disable map split mode (moved from layer control panel);
  - enable/disable new map info box  (moved from layer control panel),

* Placed an "Add Statistics" action next to the "Add Time-Series" action
  in the main toolbar for consistency.

* Improved the visibility of the layer split bar over bright map backgrounds.
  
* Revised map color mapping for simplicity and clarity. (#306, #390)
  This comprises the following changes:
  - Removed the color mapping normalisation modes. Instead, introduced
    a "Log" switch in the value-range popup. The normalisation mode
    "CAT" (categorical) is no longer required.
  - Renamed the user color mapping types "Node", "Bound", "Key" into
    "Cont." (continuous), "Stepwise", and "Categ." (categorical).
  - The color legend is now showing the variable's UI title instead of the
    variable identifier name. 
  - The value range can now be assigned from the value range
    of the color mapping values.

* Map layers that represent dataset variable's will no longer request
  tiles for regions that do not intersect with the dataset's extent. 
  This improves both viewer and server performance. (#412)

* All selectable items of the variable legend (color bar, value range)
  now show a "pointer" cursor to indicate interactivity.

* Made the right sidebar panel's tab bar position sticky. (#373)

* The title of time-series charts has been turned into a label of the 
  chart's y-axis in order to include an indication of the units when 
  snapshots are made.

* Improved visual style of selected places in the map.

### Fixes

* In the map's color legend long variable are now wrapped at words. (#410) 

* Fixed a problem in map split mode, where the left variable layer
  was still rendered on the right side so that it appeared in transparent 
  regions of the right layer. Left and right layers do not overlay each other
  anymore. (#403)

* Fixed a problem in map split mode where layer clipping was initially not 
  applied to the right layer after its visibility was switched on.    

* Fixed a problem with user color map changes that have not been automatically
  saved. User color maps are now stored after a user confirms the 
  addition, change, or removal. (#395)

* Fixed a problem that caused categorical map legends to list the categories
  without their associated colors. (#387)

* Fixed a problem where a date in the time-series chart could not be selected
  if clicked next to a data point. (#381)

* Fixed a problem with the setting that determines panning/zooming behaviour 
  after selecting a dataset or a place. The setting value "Do nothing" 
  still panned to the dataset center. (#379)

* Fixed a bug in the statistics panel which caused the app to crashed 
  (screen turned white). It reproducibly occurred when first computing 
  statistics for a point and then for a polygon. (#376)

### Other changes

* Renamed internal color mapping types from `"node"`, `"bound"`, `"key"`
  into `"continuous"`, `"stepwise"`, `"categorical"`.

## Changes in version 1.2.1

* Updated language translations for German and Swedish in the statistics panel.

## Changes in version 1.2.0

### Enhancements

* The right sidebar has been redesigned. It now uses a tab bar to switch
  between info, time-series charts, new statistics, and 3-D panels. 
  Numerous info panel styles have been adapted to harmonise with the common 
  style of the UI.

* Introduced a statistics panel, where basic statistics for the currently 
  selected variable, selected timestamp, and selected place can be computed
  and displayed. If the place is an area, statistics include  
  minimum, maximum, mean, standard deviation, and a histogram. For 
  point places the value at the point is displayed. 

* Introduced a variable comparison mode. Users can now go to the layer 
  visibility dropdown menu (see below) and enable the variable compare mode.
  This will make the variable layer  fully transparent for initially one 
  half of the map area. User can swipe a bar to shrink or enlarge the area.
  By selecting a secondary data variable using a new tool button next to the
  variable selector, a second variable layer will be rendered below the current
  variable layer. Using the compare mode the following layers can be inspected 
  next to the currently selected variable (in this order): Variable 2 layer, 
  Basemap layer Dataset RGB layer. (#286)

* Users can now define their own color bars. The new feature can be found
  in the color selector that pops up if clicking the color bar legend.
  A new category "Users" provides an add-button to add a new color bar
  definition. Existing custom color bars can be edited and deleted.
  This feature requires xcube server >= 1.6. (#334)

* Users can now select the data normalisation function to be applied before
  the actual color mapping takes place. Three functions are available:
  - `Lin`: linear mapping of data values between `min` and `max` to colors.
  - `Log`: logarithmic mapping of data values between `vmin` and `vmax` to colors.
  - `Cat`: direct mapping of categorical data values into colors.

* Improvements of the time-series charts:
  - Users can now zoom into arbitrary regions of a time-series chart
    by pressing the `CTRL` key of the keyboard. (#285)
  - It is now possible to toggle showing the info popup when hovering 
    over the chart.
  - User can fix the y-range of the chart by entering min and max values.
  - Users can now change the chart type (point, line, bars) and toggle 
    showing standard deviation directly from the time-series chart's action 
    bar.

* Introduced draggable layer visibility menu that can be opened from the 
  control bar. It also includes a new RGB layer from a secondary dataset
  so that now two different RGB layers can be compared.

* Introduced user-defined layers:
  - Users can now define their own base maps and overlay layers from
    WMS servers or tiled web maps (=XYZ).
  - Active base maps and overlay layers can be selected in the settings.

* It is now possible to specify the map view behaviour when a new dataset or
  place is selected. In the settings, users can now choose between doing 
  nothing, fly to the center of dataset bounding box or the place, 
  or fly to the center and zoom to the extent of the dataset or place.

* Specific "locate" actions have been added to the dataset and place selectors.
  At the same time the general "locate" action has been removed from the 
  control bar.

* The map setting "Show dataset boundaries" is now stored in the browser's
  local storage.

* The current variable layer is now always on top of the RGB layer of the 
  same dataset, if switched on. Layer opacity only affects the variable
  layer, not the RGB layer.

* Fixed problem with color bar selector that occurred if a variable
  used an unknown color bar name.

### Other Changes
 
* Numerous changes regarding development environment renewal and 
  code quality improvements:

  - Changed the development environment from [create-react-app](https://create-react-app.dev/) 
    and `yarn` to [vite](https://vitejs.dev/) and `npm`. (#296)
  - Reformatted code base with [prettier](https://prettier.io/) 
    using its default settings.
  - Project CI now also runs [ESlint](https://eslint.org/).
  - Updated copyright headers of source files.
  - Removed all usages of explicit `any` type in TypeScript files.
  - No longer using deprecated `adaptV4Theme()` function from `@mui/material`.
  - Applied new MUI v5 styling defaults. 

### Fixes

* Fixed a crash when loading statistics for polygon after loading point statistics. (#376)

## Changes in version 1.1.1

### Fixes

* Fixed a crash when plotting more than 10 points on map. (#299)

* Fixed a crash when resizing browser window. (#301)

### Other changes

* Inlined the help menu into the app bar. The help icon button now opens the
  [xcube Viewer documentation](https://xcube.readthedocs.io/en/latest/viewer.html)
  in a new browser tab.

* No longer obtaining Roboto font from Google servers.
  Using the static version from
  [`@fontsource/roboto`](https://fontsource.org/fonts/roboto/install)
  instead.

* Updated development dependencies and updated TypeScript code base accordingly.
    - `typescript` from v4 to v5
    - `react-scripts` from v4 to v5

* Added brief section in `README.md` of how to update xcube with a new
  xcube-viewer build.

* Renamed git default branch on GitHub from `master` into `main`. 


## Changes in version 1.1.0

* A certain column of an imported CSV table or a property of an imported GeoJSON
  feature collection can now be added to an existing time-series chart, given
  values are numerical and a column or property exists that provides
  a time value. (#276)

  This new feature required additional features that have been added:

  - When importing a CSV table or a GeoJSON object, user can specify 
    the time column name or time property.
    If given, time values are expected to be UTC and use ISO format.
  
  - Similarly, users can now specify a grouping column name or grouping
    property that will be used to create a new place group for the 
    imported places.

  - It is now possible to rename and remove an existing place groups
    and to rename and remove places, if they were previously created 
    or imported by the user.
  
* Times are now correctly displayed using standard UTC timezone 
  in ISO format. (#281)

## Changes in version 1.0.2.1

* Now reporting correct viewer version.


## Changes in version 1.0.2

* Time-series chart labels are now visible again using light theme. (#268)

* Users can now remove individual time-series from a chart. (#277)


## Changes in version 1.0.1

### Fixes

* Fixed a crash when clicking the profile menu item for logged-in
  users. (#272)

### Other

* For user login, the default value for the redirect URI 
  is now `baseUrl.href` instead of `window.location.origin` 
  in order for viewer deployments that make use of new xcube 
  server endpoint `"/viewer"` introduced in xcube 1.0.

* Now supporting [dotenv](https://github.com/motdotla/dotenv) 
  for testing while developing xcube-viewer.
  We support server configuration and auth configuration variables:
  ```bash
    # Server configuration
    REACT_APP_SERVER_ID=my_server
    REACT_APP_SERVER_NAME=My Server
    REACT_APP_SERVER_URL=http://127.0.0.1:8181
    
    # Authentication configuration
    REACT_APP_OAUTH2_AUTHORITY=https://my.authority.eu
    REACT_APP_OAUTH2_CLIENT_ID=kjJKs5n7kj5k7fo9l3
    REACT_APP_OAUTH2_AUDIENCE=https://my.audience.eu/api/
  ```

## Changes in version 1.0.0

### Enhancements

* Values of branding parameters `primaryColor` and `secondaryColor`
  can now be arbitrary HTML color hex codes, such as `"#76ff03"`.
  They used to be color names only, such as `"red"`.
  Adapted `src/recesources/config.schema.json` to reflect the change.

### Fixes

* Fixed `src/recesources/config.schema.json` where invalid item 
  `example: string` was used instead of `examples: string[]`.

* Tiles of datasets with forward slashes in their identifiers 
  (originated from nested directories) now display again correctly. 
  Tile URLs have not been URL-encoded in such cases. (#269)


## Changes in version 0.13.0

### Enhancements

* Added to information panel Python code that can be used
  to select a dataset or variable. This is useful for
  further analysing data, e.g., in Jupyter Notebooks.
  The feature can be disabled by setting
  `"branding": {..., "allowViewModePython": false}` in
  the Viewer's `config.json`.

* Improved in information panels the display of selected
  items as JSON.

* Can now run xcube Viewer in "compact" mode. This is
  primarily used for the JupyterLab integration.
  To enable compact mode, pass query parameter `compact=1`.

* Added function to insert user places from CSV/Text, GeoJSON, and WKT
  either by copy & paste, from selected file(s), or from file(s)
  dragged & dropped over the map. (#88)

  Future enhancements will allow users:
    - importing many features into own user place group,
        * so users can switch group visibility, currently always shown;
        * so users can delete the group, currently only single user places can be deleted.
    - entering character encoding, currently assuming UTF-8.
    - entering CRS, currently assuming EPSG:4326.
    - entering style/color column, currently fixed to name "color".
      Default color is "red".
    - validating also CSV and WKT in dialog, currently we only do that for GeoJSON.

* Added an experimental function that allows for rendering 
  a 3D data volume. It utilizes the new experimental xcube Server 
  endpoint `/volumes/{datasetId}/{variableName}`.
  The feature can be disabled by setting
  `"branding": {..., "allow3D": false}` in
  the Viewer's `config.json`.

* The browser window's title and favicon can now be configured
  using the two parameters
    - `windowTitle` - a string
    - `windowIcon` - abs. or rel. URL to `*.ico` icon file

* Color bar management has been slightly improved:
    - Color bars can now be reversed.
    - Color bar in the legend is now rendered according to the current
      settings "Hide small values", "Reverse", and "Opacity".

### Fixes

* Fixed user places disappearing after map projection change (#247).

* Export time series button is disabled, when there are no
  time-series to download. (#171)

* Update the privacy notice for even more transparency.

* Fixed issue with page reloading every 5 minutes after login. (#256)

### Others

* Dropped support for language locales "it" and "ro".

* Default map projection has changed from
  geographic (EPSG:4326) to web mercator (EPSG:3857)
  for performance reasons.

* Configuration resource paths are now resolved against
  `window.location.origin` plus any given sub path used
  to deploy the application.

* Tile URLs are now constructed by the viewer for well known endpoints
  `/tiles/{datasetId}/{varName}/{z}/{y}/{x}` and
  `/tiles/{datasetId}/rgb/{z}/{y}/{x}`.
  Prior to this, tile URLs from the server's dataset descriptor responses
  were used. These were wrong under certain server
  circumstances, e.g., when xcube server address is being rerouted.


## Changes in version 0.12.0 

### Enhancements

* xcube Viewer can now be used with any OIDC 1.0 compliant auth service.

* A new refresh icon in the main bar now allows updating 
  server-side resources and refresh the page.
  For this to work, the configuration setting 
  `branding.allowRefresh` must be `true`.

* The viewer app can now display also 2D datasets published by 
  xcube server (starting with xcube version 0.11.3).
  

## Changes in version 0.11.1

### Enhancements

* The viewer app can now be called with query parameters that
  preselect the dataset and variable to be displayed.
  The query parameters are `dataset` and `variable`. (#207) 

  For example, when using the demo configuration, we can preselect
  dataset with ID `remote` and the variable named `kd489`:

      http://localhost:3000/?dataset=remote&variable=kd489

* The performance of time-series fetching has been significantly improved
  by exploiting the actual chunk sizes of the time dimension of a variable.
  For this to work, the setting "Number of data points in a time series update" 
  has been replaced by "_Minimal_ number of data points in a time series update".
  The effective number of data points is now always an integer multiple of the
  actual variable's time chunk size. (#166)

* The style of the title and icons of the app's header bar can now be
  customized by two new branding properties `` and `` that can provide
  any CCS attributes (using camel-case attribute names). (#227)

  For example
  ```json
  {   
    "branding": {
      "headerTitleStyle": {
        "fontFamily": "courier",
        "color": "yellow"
      },
      "headerIconStyle": {
        "color": "black"
      }
    }
  }
  ```

* In the info panel, the dataset's spatial reference system is shown. (#225)

* It is now possible to display dataset boundaries in the map.
  A new setting "Show dataset boundaries" is available to switch this
  feature on and off. (#226)

### Fixes

* Fixed a bug that caused the app to crash when zooming into the 
  time-series chart. (#163)

* Text selection has now been disabled for the time-series charts.
  Zooming in no longer selects the axes' labels.

## Changes in version 0.11.0

### Enhancements

* Thanks to using xcube Server 0.11.x, xcube Viewer 0.11.x can now display 
  datasets with non-geographic spatial coordinate reference systems, 
  for example UTM or LAEA Europe (EPSG:3035).

* The map projection can now be changed in the settings dialog. 
  Possible value are "Geographic" and "Web Mercator".

* Now the opacity of tile layers can be changed from the color bar
  dropdown component in the map.

### Other Changes

* xcube Viewer 0.11.x requires xcube Server 0.11.x.

* The default map projection changed from Geographic (EPSG:4326) to Spherical 
  Mercator (EPSG:3857). Accordingly, image tiles are requested in Spherical 
  Mercator projection (using the same tile grid as OSM)

### Fixes

* Fixed a problem that occurred with datasets referring to the 
  same place group. In this case, only the first dataset received 
  the features on place group reload. Now all datasets 
  referring to that place group are updated on feature reload. 
  (#208)

* Fixed a problem that prevented setting the map projection 
  using the `branding.mapProjection` configuration key. 


## Changes in version 0.10.1

### Enhancements

* The map projection can now be configured using the
  `branding.mapProjection` key. Possible values are the default
  `"EPSG:4326"` (Geographic) and 
  `"EPSG:3857"` (Spherical Mercator).

### Fixes

* Feature geometries loaded from xcube Places API are now rendered again
  in the map.

* Addressed warning saying `Using target="_blank" without rel="noreferrer" 
  is a security risk`

## Changes in version 0.10.0

### Enhancements

* The logo in the application's main bar is now a link.
  The target URL can be configured using the 
  `branding.organisationUrl` key. (#176)

* Users can now manually enter a variable's min/max values that are
  applied to the selected color bar. The editor that pops up 
  when clicking the value range scale in the variable legend overlay.
  (#140)

* The viewer's map now uses EPSG:4326 projection as default so datasets
  that use this grid too will have image layers showing square pixels.

* Reduced layer flickering when a new time step is selected.
  Layer transitions are now performed more smoothly. (#119)

* We can now turn off image smoothing just for the variable layer.
  The background map is no longer concerned by this setting and
  therefore preserves its quality. (#181)

* Simplified use of xcube-viewer as a container. (#167)
  
  The ultimate goal of this activity was to get rid of build-time
  configuration and replace it by runtime configuration.
  This introduced some breaking changes as follows.
  We no longer use `.env` files for build-time configuration.
  Instead, a runtime configuration is initially loaded: 
  1. If query parameter `configPath` is given, it is loaded from
     `{origin}/{configPath}/config.json`.
  2. Otherwise, it is loaded from `{origin}/config/config.json`.
  3. If the configuration could not be fetched, the default configuration
     `src/resources/config.json` is used instead.
  
  The first option is useful for development. For example, if the app is 
  loaded from URL `{origin}?configPath=config/myapp`, its configuration is 
  loaded from `{origin}/config/myapp/config.json` where configuration 
  resources are placed in `public/config/myapp/`. For this purpose 
  `public/config/` is in `.gitignore`.
  
  The JSON schema for the configuration is given in
  `src/resources/config.schema.json`.
  
### Fixes

* Fixed issue with datasets originating from nested, filesystem-based
  data stores such as the "s3" and "file" data stores. See also 
  related https://github.com/dcs4cop/xcube/issues/579.  
  (#190)

* Fixed numerous base maps (#197)
  * Where possible, switched from HTTP to HTTPS.
  * Removed all Stamen maps - for not supporting HTTPS
  * Removed all Mapbox maps - no longer freely accessible
  * Removed selected OpenStreetMap maps:
    - OSM Black & White - no longer maintained and provided
    - OSM Landscape - no longer freely accessible

* Fixed eslint warnings of type "'ACTION' is already defined" during build.

## Changes in version 0.4.5

* After logging out, the browser now correctly redirects to the 
  viewer's origin. (#142)
* Default colour for dataset-related place groups now red while 
  initial user places colour is yellow. (#153)
* RGB layer no longer hides places. (#152)
* Users can now download time-series data as a Zip archive
  containing a GeoJSON file for each time-series graph. (#20)

  Note, this new feature must be enabled in `.env`:
  ```
  REACT_APP_ALLOW_DOWNLOADS=1
  ```
* The opacity of polygon fill colours has been made part the 
  app's branding.
* Language setting is now correctly preserved and will be 
  used on page reload. (#158)

## Changes in version 0.4.4

* Time-series legends are now always shown. (#151)
* In the time-series charts with multiple graphs, dots have only been drawn
  for the last graph added. Now they are shown for existing graphs too. (#146)
* Time-series graphs will no longer hide points. (#145)
* Fixed some labels used in the UI:
  - Renamed label "Show data points only" into "Show dots only, hide lines".
    (#148)
  - Corrected translation for "Show graph after adding a place".
* Updated package dependencies:
  - [recharts](https://recharts.org/) 2.0.9
  - [react-scripts](https://github.com/facebook/create-react-app#readme) 4.0.3


## Changes in version 0.4.3

* Indicating invalid color bar name in map legend.
* Added language translations for phrase "Time (UTC)".
* Minor
  - Fixed manifest icon paths.
  - Removed unnecessary console dumps.

## Changes in version 0.4.2

_Fixed a problem during release process. No code changes._

## Changes in version 0.4.1

* Using Roboto font in UI which increases readability of text.


## Changes in version 0.4.0

### Enhancements

* Users can now switch between median and mean methods for the spatial aggregation of 
  polygons when creating time-series. The setting is available in the settings dialog. 
  (partly addresses #135). 
* Added a "RGB" switch to the app bar that is used to display the selected dataset's RGB layer, 
  if any. Currently, RGB layers can only be configured through the xcube server. Later xcube viewer 
  versions will allow users selecting three variables and their respective value ranges for normalisation.
* Users can now login (and sign on) if the viewer is build with OAuth2 settings, if any, given 
  in a `.env.local` file (#22): 
  ```bash
  REACT_APP_OAUTH2_DOMAIN=MY_DOMAIN
  REACT_APP_OAUTH2_CLIENT_ID=MY_CLIENT_ID
  REACT_APP_OAUTH2_AUDIENCE=MY_AUDIENCE
  ``` 
* Now displaying dataset attributions when clicking the lower right info button in the map.
* Added a new panel to display information about the selected dataset, variable, and place (#114).
* Added a tool button to locate the selected dataset in the map.
* Notification "snackbars" will now disappear after 5 seconds (#107).
* The number of data points fetched within a time-series update can now be adjusted.
* Attached tooltips to many prominent viewer functions.


### Fixes

* Date/time displayed in the date/time select field and displayed in time-series plots
  are now aligned. Both use Coordinated Universal Time (UTC) and ISO format (#133).  
* When in "Show data points only" mode, values at chart points where no not shown. This now works (#120).   
* Fixed broken map selection interaction and fly-to introduced in v0.3.2 (#115).  
* If the server cannot be reached, the tool bar and colour legend are hidden 
  as datasets and variables are no longer available.
  
### Other changes

* Made the app bar a little more dense (48 instead of 56px).
* Using more intuitive icons for user login and settings.
* Added Help-icon providing a sub-menu with User Manual (coming soon) and the obligatory imprint.
* Developers can now overwrite the branding's xcube web API server setting, if any, given in a `.env.local` file:
  ```bash
  REACT_APP_BRANDING=MY_BRANDING
  REACT_APP_XCUBE_API=http://localhost:8080
  ```  
  This eases testing of yet undeployed xcube web API versions in the viewer. 

## Changes in version 0.3.2

### Enhancements

* It is now possible to change the base map layer from settings. (#30)
* Different deployments can now be configured through `.env.local` file. (#24)

### Other changes

* Updated code to use latest React 16.8 features i.e. `React.FC` with hooks (#111)

* Users can now login. (#22)

## Changes in version 0.3.1

Fixed translation of legal agreement.

## Changes in version 0.3.0

### Enhancements

* It is now possible to adjust the color bar min/max value and the colors. (#29)

### Other changes

* Now requires xcube 0.3.0 as backend.

## Changes in version 0.2.1

### Enhancements

* A new setting allows to turn image smoothing of image layers on and off.
  By default it is off now, so that crisp image pixels are shown without any blurring. (#86)
* The color bar legend uses 5 tick marks instead of the two.
* Added simple scale indicator to map.

### Other changes

* Now using OpenLayers 6.1.1.


## Changes in version 0.2.0

* Users can now draw polygons and circles and show respective time-series. (#32)
  In total there are now 4 new interactions with the map:
  - Select a geometry
  - Draw a point
  - Draw a geometry
  - Draw a circle
* Improved selection of places:
  - If a place is selected in the list it is zoomed to and highlighted in the map;
  - Places can now be selected in the map if the "Select" map interaction is active;
  - Places are also selected if a time-series line is clicked.
    (However, that doesn't work nicely yet due to issues in the Recharts lib).
* Minor fixes:
  * Fixed (actually avoided) problem indicated by text "something went wrong" appearing instead of map
    after server change. 
  * Changed user setting "show graph after adding point" to be on by default.
  * Added translations for message "server did not respond".
  * Time-series charts now have constant spacing;
  * A loading icon is shown, while time-series are being loaded.
  * Restrict zooming out, so that only a single world is shown. (#79)
  * Added legal agreement to inform about using HTML local storage. (#77)
  * Colors used for geometries in the map and for lines in the time-series charts are now exactly the same.
  * Time-series charts now have constant spacing
  * Restrict zooming out, so that only a single world is shown. (#79)
  * Added legal agreement to inform about using HTML local storage. (#77)
  * Corrected Romanian translations
* Users can now generate time series for any selected variable and any selected place. (#50)
  User places can now be also removed, which will remove related time series too.
  Removing time series, on the other hand, does no longer remove user added places.
* Selection of exact time steps has been improved. Introduced new time picker and user can also
  select move forward and backward in time by single steps. (#58)
* User can now browse settings and adjust them according to preferences in a new settings dialog:
  * xcube servers;
  * UI language;
  * whether to connect points by line (#62);
  * whether to show error bars / whether to compute stdev yes/no;
  * auto-play speed / time interval in millis;
  * whether to auto-add time-series chart if point is added (#46);
  * system-information (#93).
* Removed dummy app bar icons ("Notifications", "Avatar") and menu entry ("Settings...")
* Place groups dropdown menus are no longer displayed if a dataset has no 
  place groups and the places dropdown is no longer shown if no place group is selected. 
* Place groups (GeoJSON feature collections) are now only loaded if selected which significantly
  increases viewer loading time for server configurations whose data cubes
  are associated with lots of vector data. (#61)
* Viewer loads now in the MS Edge browser (#59)
* Fixed problem where viewer did not showInMap to selected place if that is a point location. (#52)
* Time-series are now loaded in increments so user see constantly growing time-series graph
  instead of doing nothing for tens of seconds until the server returns the complete series (#38)
* When animating through time, the index into a dataset's time coordinates array is incremented
  rather than incrementing current UI time by constant delta (#40)
* The viewer now allows for multiple time-series groups based on the variable's units (#27)
* Fixed a problem where selecting data points in time-series didn't show any data (#41)
* Added translation for Italiano and Rumeno (#25)
* Time-series are now plotted with standard deviation, if available e.g. for weekly means (#19)
* Colors of of time-series line charts are now synchronised with fill colors of points in map (#17)
* Map points and extracted time-series are now synchronised (#16):
  - When in "multi" mode, if all time-series are removed, also remove all related points in map
  - When not in "multi" mode, delete old point in map (if any) once new point is added
* It is now possible to switch between different servers (#14)

## Changes in version 0.1

Initial development version.
