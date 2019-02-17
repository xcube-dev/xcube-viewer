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

## Current Issues

* The tooltip in time series chart shows same values for all series (may be an issue in recharts!)
* The legend and tooltip in time series chart should recognize Material UI theme

## Next

* Show a variable's legend in map
* Show selected place info in card, allow media content
* Show place names in map, show tooltip for place
* Select place and show time series chart
* Get page styles right, furnish interactions
* Populate more menu:
  * Config dialog
    - set xcube-server URL
    - customize time-series chart: show points, connect null
  * External links (configurable)
  * Help dialog 
  * About dialog
* Test on mobile devices
* Internationalize texts

## Nice to have soon

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



