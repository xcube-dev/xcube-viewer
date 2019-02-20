# xcube-viewer

A simple viewer component for xcube-server

# Run it

1. Install and start [xcube-server](https://github.com/dcs4cop/xcube-server) in demo mode
2. Install and start xcube-viewer:
    ```
    $ yarn install
    $ yarn run start
    ```


# Features

## Already Working

* Select dataset, update variable and places list, fly to bounding box
* Select place (Lakes / Stations) and fly to bounding box
* Select variable and show as layer on map
* Select time and update variable layer on map
* Click in map and show time series chart
* Select dataset and fly to bounding box
* Select place and fly to bounding box
* Click in time series chart and select time
* Show selected time in time series chart
* Zoom into and out of time series chart
* Use local time in UI (backend provides UTC time only)
* Show a variable's legend in map
* Texts are internationalizable. Locales are currently "en" and "de". (see constant `I18N` in `src/config/config.ts`)

## Current Issues

* No initial time selected
* Must have means to select a time slice, currently we don't know where there is data
* The legend and tooltip in time series chart should recognize Material UI theme
* Must revise the way we will work with *places*. Each Dataset may have a list of PlaceGroups.
  * A PlaceGroup
    - produces a unique vector layer in the map;
    - can have min/max zoom level, style settings (see `ol.layer.Vector`, `ol.source.Vector` options);
    - can specify its (property) field that will provide the values for predefined roles:
      label, icon, image, description, size, area, ect.;
    - can specify its (property) fields to be used for fuzzy text search;
    - can specify a (GeoJSON) path template, and specify its template parameters whose values are extracted from another
      (selected) feature's properties.
  * In the UI
    - If a dataset has place groups, we render a drop-down list with checkboxes for each place group;
    - This will toggle the visibility of the vector layer;
    - We will have a global search field that can search for any feature provided by any place group.
      Selecting a feature from the result will cause the map to fly to its location and select its geometry so we can
      use it to generate a time-series with statistics.

## Next

* Show places with names as layer in map, show tooltip for place
* Show selected place info in card, allow media content
* Select place and show time series chart
* Log-scaled color bars (or data) for CHL.
* Compute temporal statistics for places, show std-deviations as uncertainty ranges
* Compute spatial statistics for places, show std-deviations as uncertainty ranges
* Show all variables in time series chart for given point or place
* In time series chart, show from which place it originates, select graph in chart --> fly to place
* Get page styles right, furnish interactions
* Populate more menu:
  * Config dialog
    - set xcube-server URL
    - customize time-series chart: show points, connect null
    - switch language
  * External links (configurable)
  * Help dialog 
  * About dialog
* Test on mobile devices

## Nice to have soon

* Minimize legend in map, click again to open (good for mobile) 
* Click legend and adjust colour bar and value range
* Allow other base layers (e.g. Sentinel-2 L2A RGBs, Meteorology Maps)
* Animate through time (play forw/back)
* Create place and show time series chart
* Brand the app so it can be used for different projects (texts, logos, colours, fonts)
* Allow switching light/dark theme
* User login
  - Data events subscription for logged-in users 
  - Data access for logged-in users for logged-in users 
  - Manage user created places for logged-in users



