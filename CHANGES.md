
## Changes in version 0.2 (in dev.)

* Added legal agreement to inform about using HTML local storage. (#77)
* Users can now generate time series for any selected variable and any selected place. (#50)
  User places can now be also removed, which will remove related time series too.
  Removing time series, on the other hand, does no longer remove user added places.
* Selection of exact time steps has been improved. Introduced new time picker and user can also
  select move forward and backward in time by single steps. (#58)
* User can now adjust preferences in a new settings dialog:
  * xcube servers;
  * UI language;
  * whether to connect points by line (#62);
  * whether to show error bars / whether to compute stdev yes/no;
  * auto-play speed / time interval in millis;
  * whether to auto-add time-series chart if point is added (#46).
* Removed dummy app bar icons ("Notifications", "Avatar") and menu entry ("Settings...")
* Place groups dropdown menus are no longer displayed if a dataset has no 
  place groups and the places dropdown is no longer shown if no place group is selected. 
* Place groups (GeoJSON feature collections) are now only loaded if selected which significantly
  increases viewer loading time for server configurations whose data cubes
  are associated with lots of vector data. (#61)
* Viewer loads now in the MS Edge browser (#59)
* Fixed problem where viewer did not zoom to selected place if that is a point location. (#52)
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