# xcube-viewer

A simple viewer component for Xcube server.

## Run it

1. Install [xcube](https://github.com/dcs4cop/xcube) and run server in demo mode
2. Install and start `xcube-viewer` with demo configuration

`xcube` one-time install:

    $ git clone https://github.com/dcs4cop/xcube.git
    $ cd xcube
    $ conda env create
    $ conda activate xcube
    $ python setup.py develop  

    
`xcube` update and run server:

    $ cd xcube
    $ git pull
    $ conda activate xcube  
    $ xcube server --verbose --traceperf --config xcube/webapi/res/demo/config.yml  
    


`xcube-viewer` one-time install:

    $ git clone https://github.com/dcs4cop/xcube-viewer.git
    $ cd xcube-viewer
    $ yarn install

`xcube-viewer` update and run:

    $ cd xcube-viewer
    $ git pull
    $ yarn run start


## Features

### Already Working

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
* Show modal "loading" dialog on initial data load
* Show toast on info events (e.g. server error) 
* Animate through time (play forw/back)
* Added means to select a time slice
* Time ranges set from datasets
* Place groups associated to datasets
  - produce a unique vector layer in the map;
  - can specify their feature property fields that will provide the values for predefined roles:
    "label", "infoUrl" (not used yet);

### Current Issues

* The legend and tooltip in time series chart should recognize Material UI theme
* Improve initial dataset configuration loads, currently takes seconds (main time seems to be spend loading coord vars) 
* Dataset configuration should be automatically reloaded once there are changes 

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
* Configure and test PWA

### Nice to have soon

* Minimize legend in map, click again to open (good for mobile) 
* Click legend and adjust colour bar and value range
* Allow other base layers (e.g. Sentinel-2 L2A RGBs, Meteorology Maps)
* Draw place shape (polygon, circle, rectangle) and show time series chart
* Brand the app so it can be used for different projects (texts, logos, colours, fonts)
* Allow switching light/dark theme
* User login
    - Data events subscription for logged-in users 
    - Data access for logged-in users for logged-in users 
    - Manage user created places for logged-in users
* A PlaceGroup
    - can have min/max zoom level, style settings (see `ol.layer.Vector`, `ol.source.Vector` options);
    - can specify their feature property names that will provide the values for predefined roles:
      icon, image, description, size, area, ect.;
    - can specify their feature property names to be used for fuzzy text search;
    - can specify a (GeoJSON) path template, and specify its template parameters
      whose values are extracted from another (selected) feature's properties.
* Add a search field for global search in the feature properties of all features in all place groups.
  Selecting a feature from the result will cause the map to fly to its location and select its geometry so we can
  use it to generate a time-series with statistics.



