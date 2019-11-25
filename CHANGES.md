## Changes in version 0.4.0 (in development)

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